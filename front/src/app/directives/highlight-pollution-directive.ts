import { Directive, ElementRef, Input, OnChanges, Renderer2, inject } from '@angular/core';
import { getPollutionLevel, PollutionLevel } from '../models/pollution';

const LEVEL_COLORS: Record<PollutionLevel, string> = {
  'Faible': '#c8f7c5',
  'Modérée': '#fff3a3',
  'Élevée': '#ffc078',
  'Dangereuse': '#ff8a80'
};


@Directive({
  selector: '[appHighlightPollution]',
  standalone: true
})
export class HighlightPollutionDirective implements OnChanges {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);


  @Input('appHighlightPollution') indice: number | null | undefined;


  ngOnChanges() {
    const color = this.indice == null ? null : LEVEL_COLORS[getPollutionLevel(this.indice)];

    if (color) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
    }
  }
}
