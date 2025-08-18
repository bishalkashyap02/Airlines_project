import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {
  search = { source: '', destination: '' };
  flights: any[] = [];
  message = '';

  constructor(private api: ApiService, private router: Router) {}

  searchFlights() {
    this.api.getFlights().subscribe((allFlights) => {
      this.flights = allFlights.filter(
        (f) =>
          f.source.toLowerCase() === this.search.source.toLowerCase() &&
          f.destination.toLowerCase() === this.search.destination.toLowerCase()
      );
      this.message = this.flights.length
        ? ''
        : 'No flights available for this route';
    });
  }

  bookFlight(flight: any) {
    this.api.bookFlight(flight).subscribe(() => {
      alert('Flight booked successfully!');
      this.router.navigate(['/profile']);
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortFlights(key: string) {
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

      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }
}
