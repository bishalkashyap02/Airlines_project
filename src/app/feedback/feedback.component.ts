import { Component } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  isOpen = false;

  feedback = {
    name: '',
    email: '',
    message: ''
  };

  toggleForm() {
    this.isOpen = !this.isOpen;
  }

  submitFeedback() {
    console.log("Feedback submitted:", this.feedback);
    alert("Thank you for your feedback!");
    this.feedback = { name: '', email: '', message: '' };
    this.isOpen = false; // close after submit
  }
}
