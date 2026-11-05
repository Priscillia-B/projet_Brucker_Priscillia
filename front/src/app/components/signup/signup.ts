import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignupComponent {
  private readonly userService = inject(UserService);

  isSubmitted = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  user = this.emptyUser();

  onSubmit(form: NgForm) {
    if (form.invalid || this.user.password !== this.user.confirmPassword) return;

    const { confirmPassword, ...payload } = this.user; 
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSubmitted.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.status === 409
            ? 'Ce login ou cet email est déjà utilisé.'
            : "L'inscription a échoué, réessayez plus tard."
        );
      },
    });
  }

  resetForm() {
    this.isSubmitted.set(false);
    this.errorMessage.set(null);
    this.user = this.emptyUser();
  }

  private emptyUser() {
    return { login: '', prenom: '', nom: '', email: '', password: '', confirmPassword: '' };
  }
}