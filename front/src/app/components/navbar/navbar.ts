import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth/auth.state';
import { Login, Logout } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(AuthState.user);
  readonly isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);
  readonly username = this.store.selectSignal(AuthState.username);

  async logout() {
    const user = this.user();
    this.store.dispatch(new Logout());
    const left = await this.router.navigate(['/login']);
    if (!left && user) this.store.dispatch(new Login(user));
  }
}
