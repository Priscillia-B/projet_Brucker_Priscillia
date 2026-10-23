import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution } from '../models/pollution';

@Injectable({ providedIn: 'root' })
export class PollutionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/pollutions`;

  getPollutions(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.baseUrl);
  }

  getPollutionById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.baseUrl}/${id}`);
  }

  addPollution(pollution: Pollution): Observable<Pollution> {
    return this.http.post<Pollution>(this.baseUrl, pollution);
  }

  updatePollution(id: number, pollution: Pollution): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.baseUrl}/${id}`, pollution);
  }

  deletePollution(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
