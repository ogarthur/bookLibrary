import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '@core/services';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification {
  notificationService = inject(NotificationService);
  notifications = this.notificationService.notifications;
  faCircleCheck = faCircleCheck;
}
