import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const dataInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && Array.isArray(event.body)) {
        const modifiedBody = event.body.map((item: any) => ({
          ...item,
          year: new Date(item.year).getFullYear(),
        }));
        return event.clone({ body: modifiedBody });
      }
      return event;
    }),
  );
};
