import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Page demandée avant la redirection par le guard (ex : /pollutions/3) */
  readonly returnUrl = inject(ActivatedRoute).snapshot.queryParamMap.get('returnUrl');

  readonly features = [
    { icon: 'fa-map-location-dot', title: 'Consulter les pollutions', text: 'Parcourez et filtrez toutes les pollutions recensées.' },
    { icon: 'fa-bullhorn', title: 'Déclarer une pollution', text: 'Signalez ce que vous observez : type, lieu, photo.' },
    { icon: 'fa-users', title: 'Voir la communauté', text: 'Retrouvez les membres qui participent au recensement.' }
  ];

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  credentials = { login: '', password: '' };

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.userService.login(this.credentials).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.auth.setUser(user);
        void this.router.navigateByUrl(this.safeReturnUrl());
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.status === 401
            ? 'Login ou mot de passe incorrect.'
            : 'La connexion a échoué, réessayez plus tard.'
        );
      }
    });
  }

  /** N'accepte qu'un chemin interne, pour éviter une redirection vers un autre site. */
  private safeReturnUrl(): string {
    const url = this.returnUrl;
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/pollutions';
  }
}
