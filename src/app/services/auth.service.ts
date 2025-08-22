import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  signup(payload: {
    name: string;
    address: string;
    username: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    // Only send the required fields
    //  const { name, address, username, password } = payload;
    return this.http.post(`${this.apiUrl}/signup`, payload);
  }

  signin(payload: Pick<User, 'username' | 'password'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, payload);
  }

  saveToken(token: string, role: string, id: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', id.toString());
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/signin']);
  }
}
