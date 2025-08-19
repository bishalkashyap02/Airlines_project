import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  error: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.phone || !this.formData.address) {
      this.error = 'Please fill in all details';
      return;
    }

    // ✅ Redirect to Security Page
    this.router.navigate(['/security']);
  }
}
