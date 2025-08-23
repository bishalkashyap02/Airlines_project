import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Flight } from '../../models/flight.model';
import { Booking } from '../../models/booking.model';
import { User } from '../../models/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  username = '';
  password = '';
  token: string | null = null;

  activeTab: string = 'users';
  tabIndex: number = 0;

  users: User[] = [];
  bookings: Booking[] = [];
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  datasource = new MatTableDataSource<any>([]);

  newFlight: Flight = {
    planeid: '',
    planename: '',
    source: '',
    destination: '',
    date: '',
    returnDate: '',
    price: 0,
    startTime: '',
    arrivalTime: '',
    totalTime: '',
    isRoundTrip: false,
    classType: {
      economyEnabled: false,
      economyPrice: 0,
      businessEnabled: false,
      businessPrice: 0,
    },
  };

  editingFlightId: string | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setTab('users');
    }
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
  }

  login() {
    this.http
      .post<{ token: string }>('http://localhost:3000/api/admin/login', {
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          this.token = res.token;
          localStorage.setItem('token', res.token);
          this.setTab('users');
        },
        error: () => alert('Invalid credentials'),
      });
  }

  showMessage(message: string, isError = false) {
    console.log('Snackbar called with:', message); // Debug
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  setTab(tabName: string) {
    this.activeTab = tabName;
    if (tabName === 'users') this.loadUsers();
    if (tabName === 'bookings') this.loadBookings();
    if (tabName === 'flights') this.loadFlights();
  }

  loadUsers() {
    this.http.get<User[]>('http://localhost:3000/api/users').subscribe({
      next: (data) => {
        this.users = data.filter(
          (user) => user.role?.toLowerCase() !== 'admin'
        );
      },
      error: () => alert('Failed to load users'),
    });
  }

  loadBookings() {
    this.http.get<Booking[]>('http://localhost:3000/api/bookings').subscribe({
      next: (data) => (this.bookings = data),
      error: () => alert('Failed to load bookings'),
    });
  }

  loadFlights() {
    this.http.get<Flight[]>('http://localhost:3000/api/flights').subscribe({
      next: (data) => {
        this.flights = data;
        this.filteredFlights = [...data];
        this.datasource = new MatTableDataSource<any>(this.flights);
        this.datasource.paginator = this.paginator;
      },
      error: () => alert('Failed to load flights'),
    });
  }

  addFlight(form: NgForm) {
    this.newFlight.date = this.adjustDateForTimezone(this.newFlight.date);
    if (this.newFlight.returnDate) {
      this.newFlight.returnDate = this.adjustDateForTimezone(
        this.newFlight.returnDate
      );
    }

    if (!this.token) return;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    this.http
      .post('http://localhost:3000/api/flights', this.newFlight, {
        headers,
      })
      .subscribe({
        next: () => {
          console.log('Snackbar should appear now!');
          this.loadFlights();
          this.cancelEdit(form);
          this.showMessage('Flight added successfully!');
        },
        error: () => alert('Failed to add flight'),
      });
  }

  editFlight(flight: Flight) {
    this.editingFlightId = flight.planeid;
    this.newFlight = { ...flight };
  }

  updateFlight(form: NgForm) {
    this.newFlight.date = this.adjustDateForTimezone(this.newFlight.date);
    if (this.newFlight.returnDate) {
      this.newFlight.returnDate = this.adjustDateForTimezone(
        this.newFlight.returnDate
      );
    }

    if (!this.token || !this.editingFlightId) return;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    this.http
      .put(
        `http://localhost:3000/api/flights/${this.editingFlightId}`,
        this.newFlight,
        { headers }
      )
      .subscribe({
        next: () => {
          this.loadFlights();
          this.cancelEdit(form);
          this.showMessage('Flight updated successfully!');
        },
        error: () => alert('Failed to update flight'),
      });
  }

  deleteFlight(id: string) {
    if (!this.token) return;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    this.http
      .delete(`http://localhost:3000/api/flights/${id}`, { headers })
      .subscribe({
        next: () => {
          this.loadFlights();
          this.showMessage('Flight deleted successfully!');
        },
        error: () => alert('Failed to delete flight'),
      });
  }

  cancelEdit(form?: NgForm) {
    this.editingFlightId = null;
    this.newFlight = {
      planeid: '',
      planename: '',
      source: '',
      destination: '',
      date: '',
      returnDate: '',
      price: 0,
      startTime: '',
      arrivalTime: '',
      totalTime: '',
      isRoundTrip: false,
      classType: {
        economyEnabled: false,
        economyPrice: 0,
        businessEnabled: false,
        businessPrice: 0,
      },
    };

    if (form) {
      form.resetForm();
    }
  }

  setTabByIndex(index: number) {
    this.tabIndex = index;
    if (index === 0) this.setTab('users');
    else if (index === 1) this.setTab('bookings');
    else if (index === 2) this.setTab('flights');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.router.navigateByUrl('/');
  }

  calculateTotalTime() {
    if (!this.newFlight.startTime || !this.newFlight.arrivalTime) {
      this.newFlight.totalTime = '';
      return;
    }

    const startParsed = this.parseTime12to24(this.newFlight.startTime.trim());
    const arrivalParsed = this.parseTime12to24(
      this.newFlight.arrivalTime.trim()
    );

    if (!startParsed || !arrivalParsed) {
      this.newFlight.totalTime = '';
      return;
    }

    const start = new Date();
    start.setHours(startParsed.hours, startParsed.minutes, 0, 0);

    const arrival = new Date();
    arrival.setHours(arrivalParsed.hours, arrivalParsed.minutes, 0, 0);

    let diffMs = arrival.getTime() - start.getTime();
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000;
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    this.newFlight.totalTime = `${diffHours}h ${diffMinutes}m`;
  }

  parseTime12to24(time12h: string): { hours: number; minutes: number } | null {
    const regex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = time12h.match(regex);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();

    if (meridiem === 'PM' && hours < 12) {
      hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  }

  filterFlights(filterValue: string) {
    if (!filterValue) {
      this.filteredFlights = [...this.flights];
      return;
    }
    const lowerFilter = filterValue.toLowerCase();
    this.filteredFlights = this.flights.filter(
      (flight) =>
        flight.planename.toLowerCase().includes(lowerFilter) ||
        flight.source.toLowerCase().includes(lowerFilter) ||
        flight.destination.toLowerCase().includes(lowerFilter)
    );
  }

  adjustDateForTimezone(dateStr: string): string {
    const localDate = new Date(dateStr);
    const timezoneOffset = localDate.getTimezoneOffset() * 60000;
    const correctedDate = new Date(localDate.getTime() - timezoneOffset);
    return correctedDate.toISOString().split('T')[0];
  }
}
