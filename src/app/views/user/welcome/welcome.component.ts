import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { Flight } from '../../../models/flight.model';
import { Booking } from '../../../models/booking.model';
import { ConnectionService } from '../../../services/connection.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {
  search = {
    source: '',
    destination: '',
    date: '',
    classType: '',
    isRoundTrip: false,
    returnDate: '',
  };
  flights: Flight[] = [];
  recommendedFlights: Flight[] = [];
  message = '';

  sortKey: keyof Flight | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  public connected: boolean = true;
  isRoundTrip: boolean = false;


  constructor(private api: ApiService, private router: Router, private connection: ConnectionService ) {
     connection.Changes.subscribe((state) => (this.connected = state));
  }

  ngOnInit(): void {
    this.loadRecommendedFlights();
  }

  // Load recommended flights from data.json
  loadRecommendedFlights() {
    this.api.getFlights().subscribe((allFlights) => {
      this.recommendedFlights = allFlights.slice(0, 4);
    });
  }

  searchFlights() {
    this.api.getFlights().subscribe((allFlights) => {
      this.flights = allFlights.filter((f) => {
        const matchesSource =
          f.source.toLowerCase() === this.search.source.toLowerCase();

        const matchesDestination =
          f.destination.toLowerCase() === this.search.destination.toLowerCase();

        // ✅ Date filter
        let matchesDate = true;
        if (this.search.date) {
          const flightDate = new Date(f.date).toISOString().split('T')[0];
          const searchDate = new Date(this.search.date)
            .toISOString()
            .split('T')[0];
          matchesDate = flightDate === searchDate;
        }
        let matchesClassType = true;
        if (this.search.classType) {
          if (!f.classType) {
            matchesClassType = false;
          } else if (this.search.classType === 'Economy') {
            matchesClassType = !!f.classType.economyEnabled;
          } else if (this.search.classType === 'Business') {
            matchesClassType = !!f.classType.businessEnabled;
          }
        }

        // ✅ Round trip filter
        const isRoundTrip = this.search.isRoundTrip;
        let matchesReturnDate = true;

        if (isRoundTrip && this.search.returnDate && f.returnDate) {
          const returnFlightDate = new Date(f.returnDate)
            .toISOString()
            .split('T')[0];
          const searchReturnDate = new Date(this.search.returnDate)
            .toISOString()
            .split('T')[0];
          matchesReturnDate = returnFlightDate === searchReturnDate;
        } else if (isRoundTrip && this.search.returnDate && !f.returnDate) {
          matchesReturnDate = false;
        }

        return (
          matchesSource &&
          matchesDestination &&
          matchesDate &&
          matchesClassType &&
          (!isRoundTrip || matchesReturnDate)
        );
      });

      this.message = this.flights.length
        ? ''
        : 'No flights available for the selected criteria.';
    });
  }

  bookFlight(flight: Flight) {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      alert('Please login to book a flight.');
      this.router.navigate(['/signin']);
      return;
    }
    this.router.navigate(['/booking'], { state: { flight } });
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.router.navigate(['/signin']);
  }
}
