import { inject, Injectable, signal } from '@angular/core';
import { IBook } from '@books/domain';
import { DEFAULT_BOOKS } from '@books/utils/demo.constants';
import { IBookService, LoggerService, NotificationService } from '@core/services';
import { PaginatedResult } from '@core/services/book/book-service.interface';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InMemoryBookService implements IBookService {
  private _books = signal<IBook[]>(DEFAULT_BOOKS);
  private loggerService = inject(LoggerService);
  private notificationService = inject(NotificationService);

  books = this._books.asReadonly();
  getBooks(page = 1, pageSize = 5): Observable<PaginatedResult<IBook>> {
    const items = this.books();
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = page;

    return of({
      items: items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
      totalItems,
      totalPages,
      currentPage,
      pageSize,
    });
  }

  getTotalBooks(): number {
    return this.books().length;
  }

  getBookById(id: string): Observable<IBook | undefined> {
    return of(this._books().find((book) => book.id === id));
  }

  addBook(book: IBook): Observable<boolean> {
    this._books.update((curr) => [...curr, book]);
    this.loggerService.log('Added book:', book);
    this.notificationService.showSuccess('Book added successfully');
    return of(true);
  }

  updateBook(book: IBook): Observable<boolean> {
    this._books.update((curr) => curr.map((b) => (b.id === book.id ? book : b)));
    this.loggerService.log('Updated book with id:', book.id);
    this.notificationService.showSuccess('Book updated successfully');
    return of(true);
  }

  deleteBook(id: string): Observable<boolean> {
    this._books.update((curr) => curr.filter((b) => b.id !== id));
    this.loggerService.log('Deleted book with id:', id);
    this.notificationService.showSuccess('Book deleted successfully');
    return of(true);
  }
}
