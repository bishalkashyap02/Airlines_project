import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home/home.component';
import { SigninComponent } from './views/home/signin/signin.component';
import { SignupComponent } from './views/home/signup/signup.component';
import { AdminComponent } from './views/admin/admin.component';
import { WelcomeComponent } from './views/home/welcome/welcome.component';
import { ProfileComponent } from './views/home/profile/profile.component';
import { AdminGuard } from './services/admin.guard';
import { AuthGuard } from './services/auth.guard';
import { BookingComponent } from './views/home/booking/booking.component';
import { FeedbackComponent } from './views/home/feedback/feedback.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  // {
  //   path: 'admin',
  //   loadChildren: () =>
  //     import('./views/admin/admin.module').then((m) => m.AdminModule), canActivate: [AdminGuard]
  // },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'feedback', component: FeedbackComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
