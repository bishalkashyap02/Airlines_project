import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Flights
  getFlights(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/flights`); }
  addFlight(flight: any) { return this.http.post(`${this.apiUrl}/flights`, flight); }
  updateFlight(id: any, flight: any) { return this.http.put(`${this.apiUrl}/flights/${id}`, flight); }
  deleteFlight(id: any) { return this.http.delete(`${this.apiUrl}/flights/${id}`); }

  // Bookings
  bookFlight(data: any) { return this.http.post(`${this.apiUrl}/bookings`, data); }
  getBookings(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/bookings`);
}
  cancelBooking(id: any) { return this.http.delete(`${this.apiUrl}/bookings/${id}`); }

  // Users (admin)
  getUsers() { return this.http.get(`${this.apiUrl}/users`); }
}
