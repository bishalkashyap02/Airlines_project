import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost/api/users';
   private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  login(username: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((res: { token: string; }) => {
          // Save token in service + localStorage
          localStorage.setItem(this.tokenKey, res.token);
        })
      );
  }

  // ---- GET TOKEN ----
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ---- LOGOUT ----
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
function tap(arg0: (res: { token: string; }) => void): import("rxjs").OperatorFunction<{ token: string; }, { token: string; }> {
    throw new Error('Function not implemented.');
}

