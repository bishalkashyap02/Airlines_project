import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  formData = { 
    name: '', 
    address: '', 
    username: '', 
    password: '', 
    confirmPassword: '' 
  };

  error: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    // check confirm password
    if (this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match';
      this.snackBar.open(this.error, 'Close', { duration: 3000 });
      return;
    }

    // send signup request
    this.auth.signup(this.formData).subscribe({
      next: () => {
        this.snackBar.open('Signup successful! Please sign in.', 'Close', { duration: 3000 });
        this.router.navigate(['/signin']);
      },
      error: err => {
        this.error = err.error?.message || 'Signup failed';
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      }
    });
  }
}
