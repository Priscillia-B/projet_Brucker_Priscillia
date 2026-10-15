import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignupComponent {
  private readonly auth = inject(Auth);

  isSubmitted = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  user = this.emptyUser();

  onSubmit(form: NgForm) {
    if (form.invalid || this.user.password !== this.user.confirmPassword) return;

    const { confirmPassword, ...payload } = this.user; 
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.auth.signup(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSubmitted.set(true);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set("L'inscription a échoué, réessayez plus tard.");
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