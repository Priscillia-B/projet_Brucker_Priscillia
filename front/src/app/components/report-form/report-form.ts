import { Component } from '@angular/core';
import {
  AbstractControl, FormControl, FormGroup, ReactiveFormsModule,
  ValidationErrors, Validators
} from '@angular/forms';
import { ReportSummaryComponent } from '../report-summary/report-summary';
import { Pollution } from '../../models/pollution';

/** La date doit être valide et ne pas être dans le futur. */
function validObservationDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null; // "required" s'en charge
  const date = new Date(control.value);
  if (isNaN(date.getTime())) return { invalidDate: true };
  return date > new Date() ? { futureDate: true } : null;
}

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [ReactiveFormsModule, ReportSummaryComponent],
  templateUrl: './report-form.html'
})
export class ReportFormComponent {
  isSubmitted = false;
  pollutionData!: Pollution;

  readonly typesPollution = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];
  readonly today = new Date().toISOString().split('T')[0];

  declarationForm = new FormGroup({
    titre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    date: new FormControl('', { nonNullable: true, validators: [Validators.required, validObservationDate] }),
    lieu: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    latitude: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(-90), Validators.max(90)]
    }),
    longitude: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(-180), Validators.max(180)]
    }),
    // Optionnel : vide OU URL http(s)
    photoUrl: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^(https?:\/\/\S+)?$/i)]
    })
  });

  onSubmit() {
    if (this.declarationForm.invalid) {
      this.declarationForm.markAllAsTouched();
      return;
    }
    this.pollutionData = this.declarationForm.getRawValue() as Pollution;
    this.isSubmitted = true;
  }

  newReport() {
    this.declarationForm.reset();
    this.isSubmitted = false;
  }
}