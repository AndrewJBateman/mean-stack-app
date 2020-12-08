import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model'; // import interface

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  // getter since token is private
  getToken() {

    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable(); // to be observed for logged in status as well as userId
  }

  // create new user
  createUser(email: string, password: string) {
    const authData: AuthData = { email, password }; // assign to type defined in interface
    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe(
      () => {
        //  create observable
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false); // set auth status to false on error
      }
    );
  }

  // service http login
  login(email: string, password: string) {
    const authData: AuthData = { email, password }; // assign to type defined in interface
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(
        (response) => {
          this.token = response.token;
          if (this.token) {
            const expiresInDuration = response.expiresIn; // returns as seconds
            this.setAuthTimer(expiresInDuration); // start the expiration timer
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true); // emit true for logged in
            // create expiration Date in ms and save together with token
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(this.token, expirationDate, this.userId); // save to local storage
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false); // set the status if any error
        }
      );
  }

  // service http logout
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false); // emit false

    clearTimeout(this.tokenTimer); // clear the timer at logout
    this.clearAuthData(); // clear local storage
    this.userId = null;
    this.router.navigate(['/']);
  }

  /* local functions */

  // start off authentication and token timer based on data still in local storage (not logged out)
  // gets called from app onInit
  autoAuthUser() {
    const authInformation = this.getAuthData(); // get fields from local storage
    if (!authInformation) {
      // this occurs on refresh and initial page load
      return;
    }
    // check for expiration time remaining
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime(); // positive means time remaining
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  // token expiration timer
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000); //convert to milleseconds
  }

  // functions for CRD to local storage
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString()); // must convert to ISOString in order to convert back to date
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
