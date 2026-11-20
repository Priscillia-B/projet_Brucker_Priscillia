import { Pipe, PipeTransform } from '@angular/core';
import { getPollutionLevel, PollutionLevel } from '../models/pollution';


@Pipe({
  name: 'pollutionLevel',
  standalone: true
})
export class PollutionLevelPipe implements PipeTransform {
  transform(indice: number | null | undefined): PollutionLevel | '' {
    if (indice == null) return '';
    return getPollutionLevel(indice);
  }
}
