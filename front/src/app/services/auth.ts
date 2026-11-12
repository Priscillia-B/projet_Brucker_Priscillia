import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user';

const STORAGE_KEY = 'ecotrack.currentUser';

/**
 * Authentification fictive : garde l'utilisateur connecté côté front
 * (signal + localStorage). Aucun jeton n'est échangé avec l'API.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly user = signal<User | null>(this.restore());

  readonly currentUser = this.user.asReadonly();
  readonly isLoggedIn = computed(() => this.user() !== null);

  setUser(user: User) {
    this.user.set(user);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {}
  }

  logout() {
    this.user.set(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {  }
  }

  private restore(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
