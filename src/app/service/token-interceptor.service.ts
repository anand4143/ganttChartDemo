import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {
  constructor(private router:Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: any = localStorage.getItem('token');
    const companyToken: any = localStorage.getItem('companyToken');
    const empToken: any = localStorage.getItem('empToken');
    const pToken: any = localStorage.getItem('pToken');
    const subdomain: any = localStorage.getItem('subdomain');
    if (subdomain) {
      request = request.clone({ headers: request.headers.set('x-access-domain', subdomain) });
    }
    if (token) {
      request = request.clone({ headers: request.headers.set('x-access-token', token) });
    }
    if (companyToken) {
      request = request.clone({ headers: request.headers.set('x-access-token', companyToken) });
    }
    if (empToken) {
      request = request.clone({ headers: request.headers.set('x-access-token', empToken) });
    }
    if (pToken) {
      request = request.clone({ headers: request.headers.set('x-access-token', pToken) });
    }
    if (!request.headers.has('Accept')) {
      if (!request.headers.has('Content-Type')) {
        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
      }
      request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    }
    // request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }

        return event;
      }));
  }
}
