import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Pollution } from '../../models/pollution';

@Component({
  selector: 'app-report-summary',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './report-summary.html'
})
export class ReportSummaryComponent {
  @Input({ required: true }) pollution!: Pollution;
  @Output() newReport = new EventEmitter<void>();
}