import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Remove token for login and registration requests
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
      return next.handle(req);
    }

    const token = this.authService.getToken();

    if (token) {
      const cloned = req.clone({
        setHeaders: { 
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }
   
    return next.handle(req);
  }
}
