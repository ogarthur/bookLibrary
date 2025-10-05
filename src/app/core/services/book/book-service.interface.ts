// src/app/core/services/book-service.interface.ts
import { Signal } from '@angular/core';
import { IBook } from '@books/domain';
import { Observable } from 'rxjs';

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export abstract class IBookService {
  abstract books: Signal<IBook[]>;

  // CRUD methods
  abstract getBooks(): Observable<PaginatedResult<IBook>>;
  abstract getBookById(id: string): Observable<IBook | undefined>;
  abstract addBook(book: IBook): Observable<boolean>;
  abstract updateBook(book: IBook): Observable<boolean>;
  abstract deleteBook(id: string): Observable<boolean>;
}
