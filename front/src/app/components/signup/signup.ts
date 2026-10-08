import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.html'
})
export class SignupComponent {
  isSubmitted = false;

  user = this.emptyUser();

  onSubmit(form: NgForm) {
    if (form.valid && this.user.password === this.user.confirmPassword) {
      this.isSubmitted = true;
    }
  }

  resetForm() {
    this.isSubmitted = false;
    this.user = this.emptyUser();
  }

  private emptyUser() {
    return { login: '', prenom: '', nom: '', email: '', password: '', confirmPassword: '' };
  }
}