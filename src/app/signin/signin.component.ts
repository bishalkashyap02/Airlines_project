import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  // strictly typed form data (must match model)
  formData: Pick<User, 'username' | 'password'> = {
    username: '',
    password: ''
  };

  error: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.signin(this.formData).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token, res.role, res.id);

        if (res.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/welcome']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Signin failed';
      }
    });
  }
}
