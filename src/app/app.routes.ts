import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'library',
    loadChildren: () => import('@books/application/books.routes').then((m) => m.booksRoutes),
  },
  { path: '', redirectTo: 'library', pathMatch: 'full' },
];
