import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  formData = { name: '', address: '', username: '', password: '', confirmPassword: '' };
  error = '';

  constructor(
    private auth: AuthService,
     private router: Router,
     private snackBar: MatSnackBar,

    
    ) {}



  onSubmit() {
    if (this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.auth.signup(this.formData).subscribe({
      next: () => this.router.navigate(['/signin']),
      error: err => this.error = err.error.message || 'Signup failed'
    });
  }




}
