import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Booking } from '../../../models/booking.model';
@Component({
  selector: 'app-profile', // or your actual selector
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  bookings: Booking[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.api.getBookings().subscribe((res: any[]) => {
      this.bookings = res;
    });
  }

  cancelBooking(id: number) {
    this.api.cancelBooking(id).subscribe(() => {
      this.bookings = this.bookings.filter((b) => b.id !== id);
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']); // redirect to login page
  }
  backToBooking() {
    this.router.navigate(['/welcome']);
  }
}
