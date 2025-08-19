import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

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

  error = '';
  success = '';
  passwordStrengthMessage = '';
  passwordStrengthClass: string | string[] | Set<string> | { [klass: string]: any } | null | undefined;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    if (this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.auth.signup(this.formData).subscribe({
      next: () => {
        Swal.fire({
          title: '🎉 Signup Successful!',
          text: 'Redirecting you to login...',
          icon: 'success',
          confirmButtonColor: '#4CAF50',
          confirmButtonText: 'OK',
          timer: 5000,
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['/signin']);
        });

        // Reset form
        this.formData = {
          name: '',
          address: '',
          username: '',
          password: '',
          confirmPassword: ''
        };
        this.passwordStrengthMessage = '';
        this.passwordStrengthClass = '';
      },
      error: err => {
        Swal.fire({
          html: `
            <div style="display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <span style="font-size: 1.5rem; color: #f44336; margin-right: 10px;">❌</span>
              <span style="font-size: 1rem; color: #333;">
                ${err.error.message || 'Invalid username or password!'}
              </span>
            </div>
          `,
          showConfirmButton: false,
          background: '#fff',
          width: '500px',
          padding: '2em',
          didOpen: (popup) => {
            popup.addEventListener('click', () => Swal.close());
          }
        });
      }
    });
  }

  checkPasswordStrength() {
    const pwd = this.formData.password;
    if (!pwd) {
      this.passwordStrengthMessage = '';
      this.passwordStrengthClass = '';
      return;
    }

    if (pwd.length < 6) {
      this.passwordStrengthMessage = 'Weak password';
      this.passwordStrengthClass = 'text-danger';
    } else if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) {
      this.passwordStrengthMessage = 'Strong password';
      this.passwordStrengthClass = 'text-success';
    } else {
      this.passwordStrengthMessage = 'Moderate password';
      this.passwordStrengthClass = 'text-warning';
    }
  }
}
