import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Flight } from '../../models/flight.model';
import { Booking } from '../../models/booking.model';
import { User } from '../../models/user.model';
import { UserService } from '../../models/user.service';
import { BookingService } from '../../models/booking.service';
import { FlightService } from '../../models/flight.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  username = '';
  password = '';
  token: string | null = null;

  activeTab = 'users';
  tabIndex = 0;

  users: User[] = [];
  bookings: Booking[] = [];
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];

  newFlight: Flight = {
    planeid: '',
    planename: '',
    source: '',
    destination: '',
    date: '',
    price: 0,  // keep numeric
    startTime: '',
    arrivalTime: '',
    totalTime: ''
  };

  editingFlightId: string | null = null;

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private flightService: FlightService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setTab('users');
    }
  }

  // ========= Tabs =========
  setTab(tabName: string) {
    this.activeTab = tabName;
    if (tabName === 'users') this.loadUsers();
    if (tabName === 'bookings') this.loadBookings();
    if (tabName === 'flights') this.loadFlights();
  }

  setTabByIndex(index: number) {
    this.tabIndex = index;
    if (index === 0) this.setTab('users');
    else if (index === 1) this.setTab('bookings');
    else if (index === 2) this.setTab('flights');
  }

  // ========= USERS =========
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => (this.users = data.filter((u) => u.role?.toLowerCase() !== 'admin')),
      error: () => alert('Failed to load users'),
    });
  }

  // ========= BOOKINGS =========
  loadBookings() {
    this.bookingService.getBookings().subscribe({
      next: (data) => (this.bookings = data),
      error: () => alert('Failed to load bookings'),
    });
  }

  // ========= FLIGHTS =========
  loadFlights() {
    this.flightService.getFlights().subscribe({
      next: (data) => {
        this.flights = data;
        this.filteredFlights = [...data];
      },
      error: () => alert('Failed to load flights'),
    });
  }

  addFlight(form: NgForm) {
    if (!this.token) return;
    this.flightService.addFlight(this.newFlight, this.token).subscribe({
      next: () => {
        this.loadFlights();
        this.cancelEdit(form);
        alert('Flight added successfully!');
      },
      error: () => alert('Failed to add flight'),
    });
  }

  editFlight(flight: Flight) {
    this.editingFlightId = flight.planeid;
    this.newFlight = { ...flight };
  }

  updateFlight(form: NgForm) {
    if (!this.token || !this.editingFlightId) return;
    this.flightService.updateFlight(this.editingFlightId, this.newFlight, this.token).subscribe({
      next: () => {
        this.loadFlights();
        this.cancelEdit(form);
        alert('Flight updated successfully!');
      },
      error: () => alert('Failed to update flight'),
    });
  }

  deleteFlight(id: string) {
    if (!this.token) return;
    this.flightService.deleteFlight(id, this.token).subscribe({
      next: () => {
        this.loadFlights();
        alert('Flight deleted successfully!');
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
      price: 0,
      startTime: '',
      arrivalTime: '',
      totalTime: ''
    };
    if (form) form.resetForm();
  }

  // ========= UTILS =========
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

  calculateTotalTime() {
    if (!this.newFlight.startTime || !this.newFlight.arrivalTime) {
      this.newFlight.totalTime = '';
      return;
    }

    const startParsed = this.parseTime12to24(this.newFlight.startTime.trim());
    const arrivalParsed = this.parseTime12to24(this.newFlight.arrivalTime.trim());

    if (!startParsed || !arrivalParsed) {
      this.newFlight.totalTime = '';
      return;
    }

    const start = new Date();
    start.setHours(startParsed.hours, startParsed.minutes, 0, 0);

    const arrival = new Date();
    arrival.setHours(arrivalParsed.hours, arrivalParsed.minutes, 0, 0);

    let diffMs = arrival.getTime() - start.getTime();
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    this.newFlight.totalTime = `${diffHours}h ${diffMinutes}m`;
  }

  private parseTime12to24(time12h: string): { hours: number; minutes: number } | null {
    const regex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = time12h.match(regex);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();

    if (meridiem === 'PM' && hours < 12) hours += 12;
    else if (meridiem === 'AM' && hours === 12) hours = 0;

    return { hours, minutes };
  }

  // ========= AUTH =========
  login() {
    this.userService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.token = res.token;
        this.setTab('users');
      },
      error: () => alert('Invalid credentials'),
    });
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }
}
