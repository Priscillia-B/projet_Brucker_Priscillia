import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup';
import { ReportFormComponent } from './components/report-form/report-form';

export const routes: Routes = [
  { path: '', redirectTo: 'declaration', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'declaration', component: ReportFormComponent },
  { path: '**', redirectTo: 'declaration' }
];