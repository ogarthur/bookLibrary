import { Injectable, signal } from '@angular/core';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notifications = signal<Notification[]>([]);
  notifications = this._notifications.asReadonly();

  private nextId = 0;

  showSuccess(message: string) {
    this.addNotification('success', message);
  }

  showError(message: string) {
    this.addNotification('error', message);
  }

  showInfo(message: string) {
    this.addNotification('info', message);
  }

  showWarning(message: string) {
    this.addNotification('warning', message);
  }

  private addNotification(type: Notification['type'], message: string) {
    const notification: Notification = { type, message, id: this.nextId++ };
    this._notifications.update((list) => [...list, notification]);

    // auto-remove after 4 seconds
    setTimeout(() => this.removeNotification(notification.id), 4000);
  }

  removeNotification(id: number) {
    this._notifications.update((list) => list.filter((n) => n.id !== id));
  }
}
