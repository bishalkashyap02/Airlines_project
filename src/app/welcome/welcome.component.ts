import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Flight } from '../models/flight.model';
import { Booking } from '../models/booking.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {
  search = { source: '', destination: '', date: '' };
  flights: Flight[] = [];
  message = '';

  sortKey: keyof Flight | '' = ''; // ✅ restrict key to Flight properties
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private api: ApiService, private router: Router) {}

  searchFlights() {
    this.api.getFlights().subscribe((allFlights) => {
      this.flights = allFlights.filter((f) => {
        const matchesSource =
          f.source.toLowerCase() === this.search.source.toLowerCase();
        const matchesDestination =
          f.destination.toLowerCase() === this.search.destination.toLowerCase();

        let matchesDate = true;
        if (this.search.date) {
          const flightDate = new Date(f.date).toISOString().split('T')[0];
          const searchDate = new Date(this.search.date)
            .toISOString()
            .split('T')[0];
          matchesDate = flightDate === searchDate;
        }

        return matchesSource && matchesDestination && matchesDate;
      });

      this.message = this.flights.length
        ? ''
        : 'No flights available for this route & date';
    });
  }

  bookFlight(flight: Flight) {
    const userId = Number(localStorage.getItem('userId')); // ✅ get from localStorage
    if (!userId) {
      alert('Please login to book a flight.');
      this.router.navigate(['/signin']);
      return;
    }

    const booking: Booking = {
      id: Date.now(),
      userId,
      planeId: flight.planeid.toString(),
      planeName: flight.planename,
      source: flight.source,
      destination: flight.destination,
      date: flight.date,
      price: flight.price,
      startTime: flight.startTime,
      arrivalTime: flight.arrivalTime,
      totalTime: flight.totalTime,
    };

    this.api.bookFlight(booking).subscribe(() => {
      alert('Flight booked successfully!');
      this.router.navigate(['/profile']);
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  sortFlights(key: keyof Flight) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.flights.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
  }
}