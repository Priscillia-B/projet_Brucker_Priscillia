import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PollutionService } from '../../services/pollution';
import { Pollution, POLLUTION_TYPE_ICONS, POLLUTION_TYPES } from '../../models/pollution';
import { confirmDelete, showError } from '../../utils/alerts';

@Component({
  selector: 'app-pollution-list',
  standalone: true,
  imports: [DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.scss'
})
export class PollutionListComponent implements OnInit {
  private readonly pollutionService = inject(PollutionService);

  pollutions = signal<Pollution[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  readonly typesPollution = POLLUTION_TYPES;
  readonly typeIcons = POLLUTION_TYPE_ICONS;

  filters = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    types: new FormControl<string[]>([], { nonNullable: true }), // plusieurs types possibles
    dateFrom: new FormControl('', { nonNullable: true }),
    dateTo: new FormControl('', { nonNullable: true })
  });

  private readonly filterValues = toSignal(
    this.filters.valueChanges.pipe(map(() => this.filters.getRawValue())),
    { initialValue: this.filters.getRawValue() }
  );

  hasActiveFilters = computed(() => {
    const { search, types, dateFrom, dateTo } = this.filterValues();
    return !!(search || dateFrom || dateTo || types.length);
  });

  filteredPollutions = computed(() => {
    const { search, types, dateFrom, dateTo } = this.filterValues();
    const text = search.trim().toLowerCase();

    return this.pollutions().filter(p => {
      const matchText = !text ||
        p.titre.toLowerCase().includes(text) ||
        p.lieu.toLowerCase().includes(text);
      // aucun type coché = tous les types
      const matchType = types.length === 0 || types.includes(p.type);
      const matchFrom = !dateFrom || p.date >= dateFrom;
      const matchTo = !dateTo || p.date <= dateTo;

      return matchText && matchType && matchFrom && matchTo;
    });
  });

  ngOnInit() {
    this.pollutionService.getPollutions().subscribe({
      next: (data) => {
        this.pollutions.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les pollutions.');
        this.isLoading.set(false);
      }
    });
  }

  resetFilters() {
    this.filters.reset();
  }

  /** Coche / décoche un type dans le filtre. */
  toggleType(type: string) {
    const control = this.filters.controls.types;
    control.setValue(
      control.value.includes(type)
        ? control.value.filter(t => t !== type)
        : [...control.value, type]
    );
  }

  async deletePollution(id: number) {
    if (!(await confirmDelete())) return;

    this.pollutionService.deletePollution(id).subscribe({
      next: () => this.pollutions.update(list => list.filter(p => p.id !== id)),
      error: () => showError('La suppression a échoué.')
    });
  }
}
