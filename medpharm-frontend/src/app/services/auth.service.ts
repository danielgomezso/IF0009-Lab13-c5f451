import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from '../api';
import { AuthResponse, LoginRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly session = signal<{ username: string; rol: string } | null>(
    JSON.parse(localStorage.getItem('session') ?? 'null')
  );
  readonly isLoggedIn = computed(() => !!this.token());

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, credentials).pipe(
      tap(res => {
        const session = { username: res.username, rol: res.rol };
        localStorage.setItem('token', res.token);
        localStorage.setItem('session', JSON.stringify(session));
        this.token.set(res.token);
        this.session.set(session);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('session');
    this.token.set(null);
    this.session.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return this.token();
  }
}