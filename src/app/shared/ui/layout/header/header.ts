import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <a routerLink="/">
        <div class="header-content">
          <img src="assets/images/png/logo.png" alt="Book Library Logo" />
          <h1>Book Library</h1>
        </div>
      </a>
    </header>
  `,
  styleUrl: './header.scss',
  imports: [RouterLink],
})
export class HeaderComponent {}
