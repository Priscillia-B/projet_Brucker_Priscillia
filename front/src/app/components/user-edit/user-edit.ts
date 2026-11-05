import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl, FormControl, FormGroup, ReactiveFormsModule,
  ValidationErrors, Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';
import { UserUpdate } from '../../models/user';

/** Le nouveau mot de passe (optionnel) et sa confirmation doivent correspondre. */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && password !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-edit.html'
})
export class UserEditComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);

  userId = 0;

  isLoading = signal(true);
  isSaving = signal(false);
  notFound = signal(false);
  errorMessage = signal<string | null>(null);

  userForm = new FormGroup(
    {
      prenom: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      nom: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      login: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.minLength(6), Validators.pattern(/^$|.*[0-9].*/)]
      }),
      confirmPassword: new FormControl('', { nonNullable: true })
    },
    { validators: passwordsMatch }
  );

  ngOnInit() {
    // Toujours le compte connecté : impossible de modifier quelqu'un d'autre
    this.userId = this.auth.currentUser()!.id;

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, password, ...fields } = this.userForm.getRawValue();
    const payload: UserUpdate = password ? { ...fields, password } : fields;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.userService.updateUser(this.userId, payload).subscribe({
      next: (updated) => {
        this.isSaving.set(false);
        this.auth.setUser(updated);
        void this.router.navigate(['/pollutions']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(
          err.status === 409
            ? 'Ce login ou cet email est déjà utilisé.'
            : "L'enregistrement a échoué, réessayez plus tard."
        );
      }
    });
  }
}
