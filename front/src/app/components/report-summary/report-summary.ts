import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { mapUrl, Pollution } from '../../models/pollution';
import { PollutionLevelPipe } from '../../pipes/pollution-level-pipe';
import { HighlightPollutionDirective } from '../../directives/highlight-pollution-directive';

@Component({
  selector: 'app-report-summary',
  standalone: true,
  imports: [DatePipe, RouterLink, PollutionLevelPipe, HighlightPollutionDirective],
  templateUrl: './report-summary.html'
})
export class ReportSummaryComponent {
  @Input({ required: true }) pollution!: Pollution;
  @Output() newReport = new EventEmitter<void>();

  readonly mapUrl = mapUrl;
}