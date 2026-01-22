import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly api = 'http://localhost:3000/api/auth';

  private accessToken: string | null = null;

  // used by interceptor to coordinate refresh
  public isRefreshing = false;
  public token$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  /* ---------- TOKEN MANAGEMENT ---------- */

  setToken(token: string) {
    this.accessToken = token;
    this.token$.next(token);
  }

  getToken(): string | null {
    return this.accessToken;
  }

  clearToken() {
    this.accessToken = null;
    this.token$.next(null);
  }

  /* ---------- AUTH REQUESTS ---------- */

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.api}/login`, credentials).pipe(
      tap(res => this.setToken(res.accessToken))
    );
  }

  signup(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  refresh() {
    return this.http.post<any>(`${this.api}/refresh`, {}).pipe(
      tap(res => this.setToken(res.accessToken))
    );
  }

  logout() {
    this.clearToken();
    return this.http.post(`${this.api}/logout`, {});
  }
}
