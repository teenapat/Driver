import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {User} from "../models/user.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private apiUrl = environment.apiUrl; // Access the API URL from the environment file

  constructor(private http: HttpClient) {
    // Check if user is already logged in (could be saved in local storage or a cookie)
    this.checkTokenValidity();
  }

  login(Email: string, Password: string): Observable<User> {
    // Simulating a login request to your API
    return this.http.post<User>(`${this.apiUrl}/AuthManagement/Login`, { Email, Password }).pipe(
      tap(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout(): void {
    // Clear user details from local storage or a cookie
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
}
