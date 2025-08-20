import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AdminComponent } from './admin/admin.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminGuard } from './services/admin.guard';
import { AuthGuard } from './services/auth.guard';
import { BookingComponent } from './booking/booking.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // ✅ Default Home route
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
      { path: 'feedback', component: FeedbackComponent },  // ✅ Feedback page

  { path: '**', redirectTo: '' } // ✅ Wildcard redirects to Home
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
