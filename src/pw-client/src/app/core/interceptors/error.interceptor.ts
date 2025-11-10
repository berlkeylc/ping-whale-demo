import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private toastr = inject(ToastrService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred. Please try again.';

        if (error.error) {
          // ModelState validation errors (ASP.NET Core)
          if (error.error.errors) {
            const modelStateErrors = error.error.errors;
            const errorMessages: string[] = [];
            
            Object.keys(modelStateErrors).forEach(key => {
              const errors = modelStateErrors[key];
              if (Array.isArray(errors)) {
                errorMessages.push(...errors);
              } else {
                errorMessages.push(errors);
              }
            });
            
            if (errorMessages.length > 0) {
              errorMessage = errorMessages.join(', ');
            }
          }
          // Direct error message
          else if (error.error.message) {
            errorMessage = error.error.message;
          }
          else if (error.error.Message) {
            errorMessage = error.error.Message;
          }
          else if (typeof error.error === 'string') {
            errorMessage = error.error;
          }
        }
        // HTTP status code based messages
        else if (error.status === 0) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
        }
        else if (error.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        }
        else if (error.status === 403) {
          errorMessage = 'Access forbidden.';
        }
        else if (error.status === 404) {
          errorMessage = 'Resource not found.';
        }
        else if (error.status === 500) {
          errorMessage = 'Internal server error. Please try again later.';
        }
        else if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        // Show toast
        this.toastr.error(errorMessage, 'Error', {
          timeOut: 7000,
          closeButton: true
        });

        return throwError(() => error);
      })
    );
  }
}

