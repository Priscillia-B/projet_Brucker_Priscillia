import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl, FormControl, FormGroup, ReactiveFormsModule,
  ValidationErrors, Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth/auth.state';
import { Login, Logout } from '../../store/auth/auth.actions';
import { UserUpdate } from '../../models/user';
import { confirmDelete, showError } from '../../utils/alerts';
import { HasUnsavedChanges } from '../../guards/unsaved-changes-guard';

/** Le nouveau mot de passe (optionnel) et sa confirmation doivent correspondre. */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && password !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-user-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss'
})
export class UserEditComponent implements OnInit, HasUnsavedChanges {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly store = inject(Store);

  userId = 0;

  isLoading = signal(true);
  isSaving = signal(false);
  isDeleting = signal(false);
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
    this.userId = this.store.selectSnapshot(AuthState.user)!.id;

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
        // Profil modifié : on remet à jour l'utilisateur dans le store
        this.store.dispatch(new Login(updated));
        this.userForm.markAsPristine(); 
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

  hasUnsavedChanges(): boolean {
    return this.userForm.dirty;
  }

  async deleteAccount() {
    if (!(await confirmDelete('Supprimer votre compte ?'))) return;

    this.isDeleting.set(true);
    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        this.userForm.markAsPristine();
        this.store.dispatch(new Logout());
        void this.router.navigate(['/login']);
      },
      error: () => {
        this.isDeleting.set(false);
        void showError('La suppression du compte a échoué.');
      }
    });
  }
}
