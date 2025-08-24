import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from './flight.model';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private apiUrl = 'http://localhost/api/flights';

  constructor(private http: HttpClient) {}

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }

  addFlight(flight: Flight, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, flight, { headers });
  }

  updateFlight(id: string, flight: Flight, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, flight, { headers });
  }

  deleteFlight(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
