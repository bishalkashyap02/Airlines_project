import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking.component';
import { DetailsComponent } from './details/details.component';
import { PaymentComponent } from './payment/payment.component';
import { SecurityComponent } from './security/security.component';

const routes: Routes = [
  { path: 'booking', component: BookingComponent },
  { path: 'booking/details', component: DetailsComponent},

  { path: 'booking/payment', component: PaymentComponent },
  { path: 'booking/security', component: SecurityComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule {}
