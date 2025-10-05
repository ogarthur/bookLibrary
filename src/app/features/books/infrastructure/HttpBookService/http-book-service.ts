import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IBook } from '@books/domain';
import { IBookService, PaginatedResult } from '@core/services/book/book-service.interface';
import { environment } from 'environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpBookService implements IBookService {
  private environment = environment;
  private apiUrl = this.environment.apiUrl;
  private http = inject(HttpClient);

  private _books = signal<IBook[]>([]);

  books = this._books.asReadonly();

  loadBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(`${this.apiUrl}/books`).pipe(
      map((data) => {
        this._books.set(data);
        return data;
      }),
    );
  }

  getBooks(page = 1, pageSize = 5): Observable<PaginatedResult<IBook>> {
    const currentBooks = this.books();
    if (currentBooks.length > 0) {
      // already loaded, return immediately
      return of(this.paginate(currentBooks, page, pageSize));
    }
    // not loaded, fetch from API and store in signal
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
        console.error('Failed to fetch book by ID:', err);
        return of(undefined);
      }),
    );
  }

  addBook(book: IBook): Observable<boolean> {
    return this.http.post<IBook>(this.apiUrl, book).pipe(
      tap((created) => this._books.update((curr) => [...curr, created])),
      map(() => true),
      catchError((err) => {
        console.error('Failed to add book:', err);
        return of(false);
      }),
    );
  }

  updateBook(book: IBook): Observable<boolean> {
    return this.http.put<IBook>(`${this.apiUrl}/${book.id}`, book).pipe(
      tap((updated) => {
        this._books.update((curr) => curr.map((b) => (b.id === updated.id ? updated : b)));
      }),
      map(() => true),
      catchError((err) => {
        console.error('Failed to update book:', err);
        return of(false);
      }),
    );
  }

  deleteBook(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._books.update((curr) => curr.filter((b) => b.id !== id));
      }),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
