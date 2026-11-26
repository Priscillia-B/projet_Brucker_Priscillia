import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Login, Logout } from './auth.actions';
import { AuthStateModel, UserProfile } from './auth.model';

const DEFAULT_AUTH_STATE: AuthStateModel = {
  user: null,
  isAuthenticated: false
};

@State<AuthStateModel>({
  name: 'auth',
  defaults: DEFAULT_AUTH_STATE
})
@Injectable()
export class AuthState {

  @Selector()
  static user(state: AuthStateModel): UserProfile | null {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static username(state: AuthStateModel): string | null {
    return state.user ? state.user.prenom || state.user.nom : null;
  }


  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({
      user: { ...action.payload, role: 'membre' },
      isAuthenticated: true
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState(DEFAULT_AUTH_STATE);
  }
}
