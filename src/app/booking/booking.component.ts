import { Component } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  items = [
  {label: 'Details'},
  {label: 'Security Confirmation'},
  {label: 'Payment'}
];
activeIndex = 0;

finish() {
  alert("Stepper Completed!");
}

}


