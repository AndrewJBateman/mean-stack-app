import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service'; // required for access to token via its getter

@Injectable() // used to inject AuthService
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // HttpRequest is of static type; intercept <any> outgoing requests
    const authToken = this.authService.getToken(); // call token getter to retrieve
    const authRequest = req.clone({
      // cloning is required; built-in method allows adding headers;
      headers: req.headers.set('Authorization', `Bearer ${authToken}`), // added Authorization header with token
    });
    return next.handle(authRequest); // returning the clone
  }
}
