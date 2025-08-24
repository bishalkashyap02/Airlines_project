import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../models/user.model';
import { Booking } from '../../../models/booking.model';
import { Flight } from '../../../models/flight.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent {
  detailsForm: FormGroup;
  securityForm: FormGroup;
  paymentForm: FormGroup;

  users: User[] = [];
  currentUser?: User;
  selectedFlight: Flight | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    private api: ApiService
  ) {
    // ✅ Retrieve selected flight from router state
    const nav = this.router.getCurrentNavigation();
    this.selectedFlight = nav?.extras?.state?.['flight'] || null;

    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      autoFill: [false],
    });

    this.securityForm = this.fb.group({
      food: [false],
      accommodation: [false],
      transport: [false],
    });

    this.paymentForm = this.fb.group({});
  }

  toggleAutoFill() {
    const isAutoFill = this.detailsForm.value.autoFill;
    const userId = Number(localStorage.getItem('userId'));

    if (isAutoFill && userId) {
      this.http
        .get<User>(`http://localhost/api/users/${userId}`)
        .subscribe({
          next: (user) => {
            this.currentUser = user;
            this.detailsForm.patchValue({
              name: user.name,
            });
          },
          error: () => {
            alert('Failed to fetch user info');
            this.detailsForm.patchValue({ name: '' });
          },
        });
    } else {
      this.detailsForm.patchValue({ name: '' });
    }
  }

  bookFlight(selectedFlight: any) {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      alert('Please login to book a flight.');
      this.router.navigate(['/signin']);
      return;
    }

    if (!this.selectedFlight) {
      alert('No flight selected.');
      return;
    }

    const booking: Booking = {
      id: Date.now(),
      userId,
      planeId: this.selectedFlight.planeid.toString(),
      planeName: this.selectedFlight.planename,
      source: this.selectedFlight.source,
      destination: this.selectedFlight.destination,
      date: this.selectedFlight.date,
      price: this.selectedFlight.price,
      startTime: this.selectedFlight.startTime,
      arrivalTime: this.selectedFlight.arrivalTime,
      totalTime: this.selectedFlight.totalTime,
    };

    this.api.bookFlight(booking).subscribe(() => {
      this.snackBar.open('Flight booked successfully!', 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/profile']);
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  /** Pay and finalize booking */
  pay() {
    if (!this.detailsForm.valid || !this.securityForm.valid) {
      alert('Please complete all steps before payment.');
      return;
    }

    this.snackBar.open('Payment Successful!', 'Close', { duration: 3000 });
    this.router.navigate(['/profile']);
  }
}
