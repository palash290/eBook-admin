import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'e-book-admin';

  constructor(private router: Router,) { }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const existingScript = document.querySelector('script[src="assets/js/main.js"]');
        if (existingScript) {
          existingScript.remove();
        }
        const scriptElement = document.createElement('script');
        scriptElement.src = 'assets/js/main.js';
        scriptElement.async = true;
        document.body.appendChild(scriptElement);
      }
    });
  }
}
