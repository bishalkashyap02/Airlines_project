import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

import { BookingRoutingModule } from './booking-routing.module';
import { DetailsComponent } from './details/details.component';
import { SecurityComponent } from './security/security.component';
import { PaymentComponent } from './payment/payment.component';
import { BookingComponent } from './booking.component';

@NgModule({
  declarations: [
    BookingComponent,
    DetailsComponent,
    SecurityComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    FormsModule,
    ReactiveFormsModule,   // 👈 add this
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatStepperModule
  ]
})
export class BookingModule {}
