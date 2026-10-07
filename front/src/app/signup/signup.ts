import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent {
  isSubmitted = false;

  user = {
    login: '',
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onSubmit(form: NgForm) {
    if (form.valid && this.user.password === this.user.confirmPassword) {
      this.isSubmitted = true;
    }
  }

  resetForm() {
    this.isSubmitted = false;
    this.user = {
      login: '',
      prenom: '',
      nom: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }
}