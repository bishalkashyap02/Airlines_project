import { NavigationEnd, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'airline';
  hideButtons = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide buttons on /welcome or /profile routes
        this.hideButtons = ['/welcome', '/profile', '/booking'].includes(
          event.url
        );
      }
    });
  }
}
