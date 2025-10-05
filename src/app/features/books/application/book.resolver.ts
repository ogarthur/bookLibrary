import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IBook } from '@books/domain';
import { InMemoryBookService } from '@books/infrastructure/InMemoryBookService/in-memory-book-service';
import { HttpBookService } from '@books/infrastructure';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class BookResolver implements Resolve<IBook | undefined> {
  iBookService = !environment.useHttpBooks ? inject(InMemoryBookService) : inject(HttpBookService);
  //bookService = inject(HttpBookService);

  router = inject(Router);

  resolve(route: ActivatedRouteSnapshot): Observable<IBook | undefined> {
    const id = route.paramMap.get('id');
    if (!id) return EMPTY;

    return this.iBookService.getBookById(id).pipe(
      catchError(() => {
        this.router.navigate(['/books']); // fallback if error
        return EMPTY;
      }),
    );
  }
}
