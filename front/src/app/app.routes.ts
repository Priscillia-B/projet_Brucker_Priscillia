import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup';
import { ReportFormComponent } from './components/report-form/report-form';
import { PollutionListComponent } from './components/pollution-list/pollution-list';
import { PollutionDetailComponent } from './components/pollution-detail/pollution-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'declaration', component: ReportFormComponent },
  { path: 'pollutions', component: PollutionListComponent },
  { path: 'pollutions/:id', component: PollutionDetailComponent },
  { path: 'pollutions/:id/edit', component: ReportFormComponent },
  { path: '**', redirectTo: 'pollutions' }
];