import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { InMemoryBookService } from '@books/infrastructure/InMemoryBookService/in-memory-book-service';
import { IBookService } from '@core/services';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { dataInterceptor } from '@core/interceptors/data/data-interceptor';
import { errorInterceptor } from '@core/interceptors/error/error-interceptor';
import { HttpBookService } from '@books/infrastructure';
import { environment } from 'environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([dataInterceptor, errorInterceptor])),
    {
      provide: IBookService,
      useClass: !environment.useHttpBooks ? InMemoryBookService : HttpBookService,
    },
  ],
};
