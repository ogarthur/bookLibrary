import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notification } from '@core/ui/notification/notification';
import { HeaderComponent } from '@shared/ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, Notification],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('bookLibrary');
}
