import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent {
  constructor(private router: Router) {}
  isOpen = false;

  feedback = {
    name: '',
    email: '',
    message: '',
  };

  toggleForm() {
    this.isOpen = !this.isOpen;
  }

  submitFeedback() {
    console.log('Feedback submitted:', this.feedback);
    alert('Thank you for your feedback!');
    this.feedback = { name: '', email: '', message: '' };
    this.isOpen = false;
    this.router.navigateByUrl('/');
  }
}
