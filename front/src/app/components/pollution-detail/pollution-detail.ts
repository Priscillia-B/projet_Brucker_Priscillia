import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PollutionService } from '../../services/pollution';
import { mapUrl, Pollution } from '../../models/pollution';
import { confirmDelete, showError } from '../../utils/alerts';

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.scss'
})
export class PollutionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pollutionService = inject(PollutionService);

  pollution = signal<Pollution | null>(null);
  isLoading = signal(true);

  readonly mapUrl = mapUrl;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.pollutionService.getPollutionById(id).subscribe({
      next: (data) => {
        this.pollution.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  async deletePollution(id: number) {
    if (!(await confirmDelete())) return;

    this.pollutionService.deletePollution(id).subscribe({
      next: () => void this.router.navigate(['/pollutions']),
      error: () => void showError('La suppression a échoué.')
    });
  }
}
