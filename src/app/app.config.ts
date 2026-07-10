import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import {
  provideLucideIcons,
  LucideX,
  LucideEye,
  LucideEyeOff,
  LucideCalendar,
  LucideCircleCheckBig,
  LucideCircleX,
  LucideClock,
  LucidePlus,
  LucideMail,
  LucideTrash2,
  LucideArrowLeft,
  LucideTriangleAlert,
  LucideCalendarX2,
  LucideEllipsisVertical,
  LucidePencil,
  LucideLogOut,
  LucideMenu,
  LucideSun,
  LucideMoon,
} from '@lucide/angular';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideLucideIcons(
      LucideX,
      LucideEye,
      LucideEyeOff,
      LucideCalendar,
      LucideCircleCheckBig,
      LucideCircleX,
      LucideClock,
      LucidePlus,
      LucideMail,
      LucideTrash2,
      LucideArrowLeft,
      LucideTriangleAlert,
      LucideCalendarX2,
      LucideEllipsisVertical,
      LucidePencil,
      LucideLogOut,
      LucideMenu,
      LucideSun,
      LucideMoon,
    ),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideTranslateService(),
    provideTranslateHttpLoader({
      prefix: '/assets/i18n/',
      suffix: '.json',
    }),
  ],
};
