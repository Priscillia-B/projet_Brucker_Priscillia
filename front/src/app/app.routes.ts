import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth-guard';
import { unsavedChangesGuard } from './guards/unsaved-changes-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canMatch: [guestGuard],
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    canMatch: [guestGuard],
    loadComponent: () => import('./components/signup/signup').then(m => m.SignupComponent)
  },

  // Pages réservées aux utilisateurs connectés
  {
    path: 'declaration',
    canMatch: [authGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./components/report-form/report-form').then(m => m.ReportFormComponent)
  },
  {
    path: 'pollutions',
    canMatch: [authGuard],
    loadComponent: () => import('./components/pollution-list/pollution-list').then(m => m.PollutionListComponent)
  },
  {
    path: 'pollutions/:id',
    canMatch: [authGuard],
    loadComponent: () => import('./components/pollution-detail/pollution-detail').then(m => m.PollutionDetailComponent)
  },
  {
    path: 'pollutions/:id/edit',
    canMatch: [authGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./components/report-form/report-form').then(m => m.ReportFormComponent)
  },
  {
    path: 'users',
    canMatch: [authGuard],
    loadComponent: () => import('./components/user-list/user-list').then(m => m.UserListComponent)
  },
  {
    path: 'mon-compte',
    canMatch: [authGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./components/user-edit/user-edit').then(m => m.UserEditComponent)
  },

  { path: '**', redirectTo: 'login' }
];
