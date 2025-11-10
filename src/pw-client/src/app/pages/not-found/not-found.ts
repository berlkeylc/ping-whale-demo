import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.html'
})
export class NotFound implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateHome() {
    const isAuthenticated = this.authService.isLoggedIn();
    this.router.navigate([isAuthenticated ? '/dashboard' : '/']);
  }

  ngOnInit() {
  }
}
