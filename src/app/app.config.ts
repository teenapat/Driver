import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import {JwtInterceptor} from "./core/interceptors/jwt.interceptor";
import {spinnerInterceptor} from "./core/interceptors/spinner.interceptor";
import {authInterceptor} from "./core/interceptors/auth.interceptor";
import {TokenInterceptor} from "./core/interceptors/token.interceptor";

export const appConfig: ApplicationConfig = {
  providers:[
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([spinnerInterceptor, authInterceptor])
    ),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
};
