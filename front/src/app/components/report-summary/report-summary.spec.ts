import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportSummary } from './report-summary';

describe('ReportSummary', () => {
  let component: ReportSummary;
  let fixture: ComponentFixture<ReportSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
