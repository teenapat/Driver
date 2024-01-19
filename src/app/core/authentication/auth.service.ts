import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {User} from "../models/user.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.checkTokenValidity();
  }

  login(Email: string, Password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/AuthManagement/Login`, { Email, Password }).pipe(
      tap(user => {
        if (user && user.token) {
          this.storeUserDetails(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private checkTokenValidity(): void {
    if (typeof localStorage !== 'undefined') {
      const user: User | null = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (user && user.token) {
        this.loggedIn.next(true);
      }
    } else {
      console.warn('localStorage is not available in this environment');
    }
  }

  getToken(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser).token : null;
  }

  getRefreshToken(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser).refreshToken : null;
  }

  refreshToken(): Observable<User> {
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return throwError('No tokens found');
    }

    return this.http.post<User>(`${this.apiUrl}/AuthManagement/refresh-token`, { AccessToken: accessToken, RefreshToken: refreshToken }).pipe(
      tap(user => {
        if (user && user.token) {
          this.storeUserDetails(user);
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  private storeUserDetails(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.loggedIn.next(true);
  }
}
