import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SignupRequest, SignupResponse } from '../models/user';

@Injectable({ providedIn: 'root' })
export class Auth {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/auth`;

    signup(payload: SignupRequest): Observable<SignupResponse> {
        return this.http.post<SignupResponse>(`${this.baseUrl}/signup`, payload);
    }
}