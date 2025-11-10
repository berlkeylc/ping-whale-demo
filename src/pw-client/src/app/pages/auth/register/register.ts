import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styles: [`
    .error { color: red; font-size: 12px; }
    .api-error { color: darkred; font-size: 14px; margin-top: 5px; }
  `]
})
export class RegisterComponent {
  apiError = signal<string | null>(null);
  registerForm!: FormGroup;
  

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: any) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.apiError.set(null);
    const { email, password } = this.registerForm.value;

    this.auth.register(email!, password!).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.apiError.set(err?.error?.Message || 'Registration failed. Please try again.');
      }
    });
  }
}
