import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {AuthService} from "../authentication/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap((refreshResponse: any) => {
              const newRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${refreshResponse.token}`
                }
              });
              return next.handle(newRequest);
            }),
            catchError((refreshError: any) => {
              return throwError(refreshError);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
