import { Component } from '@angular/core';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent {
  securityData = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  error: string | null = null;

  onSubmit() {
    if (this.securityData.password !== this.securityData.confirmPassword) {
      this.error = "Passwords do not match!";
    } else {
      this.error = null;
      console.log("Security Data Submitted:", this.securityData);
      // 👉 emit data to parent or move stepper forward
    }
  }
}
