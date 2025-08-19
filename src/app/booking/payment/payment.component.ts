import { Component, OnDestroy } from '@angular/core';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnDestroy {
  payment = { cardHolder: '', cardNumber: '', expiry: '', cvv: '' };

  constructor(private bookingService: BookingService) {}

  ngOnDestroy() {
    this.bookingService.setStepData('payment', this.payment);
  }
}
