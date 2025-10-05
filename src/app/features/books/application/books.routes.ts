import { Route } from '@angular/router';
import { BookListComponent, BookDetailComponent } from '@books/ui';
import { BookResolver } from './book.resolver';

export const booksRoutes: Route[] = [
  { path: '', component: BookListComponent },
  { path: ':id', component: BookDetailComponent, resolve: { book: BookResolver } },
  { path: '**', redirectTo: 'library' },
];
