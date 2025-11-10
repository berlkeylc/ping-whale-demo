import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginUserRequest } from '../models/LoginUserRequest';
import { CreateUserRequest } from '../models/CreateUserRequest';

@Injectable({
  providedIn: 'root'
})




export class AuthService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    let request: LoginUserRequest = {
    usernameOrEmail: email,
    password: password
  };

    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, request)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token); 
        })
      );
  }

  register(email: string, password: string) {
       let request: CreateUserRequest = {
    Email: email,
    Password: password
  };
    return this.http.post(`${this.apiUrl}/auth/register`, request);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
