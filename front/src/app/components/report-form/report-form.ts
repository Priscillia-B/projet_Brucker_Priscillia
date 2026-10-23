import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl, FormControl, FormGroup, ReactiveFormsModule,
  ValidationErrors, Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReportSummaryComponent } from '../report-summary/report-summary';
import { PollutionService } from '../../services/pollution';
import { Pollution, POLLUTION_TYPES } from '../../models/pollution';

/** La date doit être valide et ne pas être dans le futur. */
function validObservationDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const date = new Date(control.value);
  if (isNaN(date.getTime())) return { invalidDate: true };
  return date > new Date() ? { futureDate: true } : null;
}

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ReportSummaryComponent],
  templateUrl: './report-form.html'
})
export class ReportFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pollutionService = inject(PollutionService);

  editId: number | null = null;

  savedPollution = signal<Pollution | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  readonly typesPollution = POLLUTION_TYPES;
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

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.editId = Number(id);
    this.isLoading.set(true);
    this.pollutionService.getPollutionById(this.editId).subscribe({
      next: (p) => {
        this.declarationForm.patchValue({ ...p, photoUrl: p.photoUrl ?? '' });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Pollution introuvable.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.declarationForm.invalid) {
      this.declarationForm.markAllAsTouched();
      return;
    }

    const pollution = this.declarationForm.getRawValue() as Pollution;
    const request$ = this.editId
      ? this.pollutionService.updatePollution(this.editId, pollution)
      : this.pollutionService.addPollution(pollution);

    this.isSaving.set(true);
    this.errorMessage.set(null);

    request$.subscribe({
      next: (saved) => {
        this.isSaving.set(false);
        if (this.editId) {
          void this.router.navigate(['/pollutions']);
        } else {
          this.savedPollution.set(saved);
        }
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set("L'enregistrement a échoué, réessayez plus tard.");
      }
    });
  }

  newReport() {
    this.declarationForm.reset();
    this.savedPollution.set(null);
  }
}
