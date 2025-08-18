import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  signup(payload: { name: string; address: string; username: string; password: string; confirmPassword: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, payload);
  }

  signin(payload: { username: string; password: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, payload);
  }

  saveToken(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    // Basic check — you can extend to verify expiry via JWT decode
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/signin']);
  }
}
