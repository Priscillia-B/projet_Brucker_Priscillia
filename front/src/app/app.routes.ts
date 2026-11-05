import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup';
import { ReportFormComponent } from './components/report-form/report-form';
import { PollutionListComponent } from './components/pollution-list/pollution-list';
import { PollutionDetailComponent } from './components/pollution-detail/pollution-detail';
import { UserListComponent } from './components/user-list/user-list';
import { LoginComponent } from './components/login/login';
import { authGuard, guestGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },

  // Pages réservées aux utilisateurs connectés
  { path: 'declaration', component: ReportFormComponent, canActivate: [authGuard] },
  { path: 'pollutions', component: PollutionListComponent, canActivate: [authGuard] },
  { path: 'pollutions/:id', component: PollutionDetailComponent, canActivate: [authGuard] },
  { path: 'pollutions/:id/edit', component: ReportFormComponent, canActivate: [authGuard] },
  { path: 'users', component: UserListComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];
