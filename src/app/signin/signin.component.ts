import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  formData = { username: '', password: '' };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.signin(this.formData).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token, res.role);
        if (res.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/welcome']);
        }
      },
      error: err => this.error = err.error.message || 'Signin failed'
    });
  }
}
