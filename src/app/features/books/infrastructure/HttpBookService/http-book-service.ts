import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IBook } from '@books/domain';
import { LoggerService, NotificationService } from '@core/services';
import { IBookService, PaginatedResult } from '@core/services/book/book-service.interface';
import { environment } from 'environments/environment';
import { catchError, first, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpBookService implements IBookService {
  private environment = environment;
  private apiUrl = this.environment.apiUrl;
  private http = inject(HttpClient);
  private loggerService = inject(LoggerService);
  private notificationService = inject(NotificationService);

  private _books = signal<IBook[]>([]);

  books = this._books.asReadonly();

  loadBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(`${this.apiUrl}/books`).pipe(
      first(),
      map((data) => {
        this._books.set(data);
        return data;
      }),
    );
  }

  getBooks(page = 1, pageSize = 5): Observable<PaginatedResult<IBook>> {
    const currentBooks = this.books();
    if (currentBooks.length > 0) {
      return of(this.paginate(currentBooks, page, pageSize));
    }
    return this.loadBooks().pipe(map((books) => this.paginate(books, page, pageSize)));
  }

  private paginate(items: IBook[], page: number, pageSize: number): PaginatedResult<IBook> {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      items: items.slice((page - 1) * pageSize, page * pageSize),
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
    };
  }

  getTotalBooks(): number {
    return this.books().length;
  }

  getBookById(id: string): Observable<IBook | undefined> {
    const book = this.books().find((b) => b.id === id);
    if (book) {
      return of(book);
    }
    return this.http.get<IBook>(`${this.apiUrl}/books/${id}`).pipe(
      catchError((err) => {
        this.loggerService.error('Failed to fetch book by ID:', err);
        return of(undefined);
      }),
    );
  }

  addBook(book: IBook): Observable<boolean> {
    return this.http.post<IBook>(this.apiUrl, book).pipe(
      first(),
      tap((created) => this._books.update((curr) => [...curr, created])),
      map(() => {
        this.loggerService.log('Added book:', book);
        this.notificationService.showSuccess('Book added successfully');
        return true;
      }),
      catchError((err) => {
        this.loggerService.error('Failed to add book:', err);
        this.notificationService.showError('Failed to add book');
        return of(false);
      }),
    );
  }

  updateBook(book: IBook): Observable<boolean> {
    return this.http.put<IBook>(`${this.apiUrl}/${book.id}`, book).pipe(
      first(),
      tap((updated) => {
        this._books.update((curr) => curr.map((b) => (b.id === updated.id ? updated : b)));
        this.loggerService.log('Updated book with id:', book.id);
        this.notificationService.showSuccess('Book updated successfully');
      }),
      map(() => {
        return true;
      }),
      catchError((err) => {
        this.loggerService.error('Failed to update book:', err);
        this.notificationService.showError('Failed to update book');
        return of(false);
      }),
    );
  }

  deleteBook(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._books.update((curr) => curr.filter((b) => b.id !== id));
      }),
      map(() => {
        this.loggerService.log('Deleted book with id:', id);
        this.notificationService.showSuccess('Book deleted successfully');
        return true;
      }),
      catchError(() => {
        this.loggerService.error('Failed to delete book with id:', id);
        this.notificationService.showError('Failed to delete book');
        return of(false);
      }),
    );
  }
}
