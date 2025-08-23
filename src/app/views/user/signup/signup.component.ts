import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  formData = {
    name: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  submitted = false;
  signupSuccess = false;
  loading = false;

  errorMessage = '';

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    this.submitted = true;

    if (this.formData.password !== this.formData.confirmPassword) {
      this.showPopup('Passwords do not match', false);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.signup(this.formData).subscribe({
      next: () => {
        this.loading = false;
        this.signupSuccess = true;
        this.showPopup('Signup successful!', true);
      },
      error: (err) => {
        this.loading = false;
        this.signupSuccess = false;
        this.errorMessage =
          err.error?.message || 'Signup failed. Please try again.';
        this.showPopup(this.errorMessage, false);
      },
    });
  }

  private showPopup(message: string, success: boolean): void {
    const snackBarRef = this.snackBar.open(message, 'Close', {
      duration: success ? 15000 : undefined,
      panelClass: success ? ['snackbar-success'] : ['snackbar-error'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      if (success) {
        this.router.navigate(['/signin']);
      } else {
        this.router.navigate(['/signup']);
      }
    });
  }
}
