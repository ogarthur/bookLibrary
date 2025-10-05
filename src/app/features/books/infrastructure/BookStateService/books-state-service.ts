import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookStateService {
  currentPage = signal(1);
  pageSize = signal(5);
}
