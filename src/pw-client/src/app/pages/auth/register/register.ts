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
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Email</label>
        <input formControlName="email" type="email" />
        <div class="error" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid">
          <div *ngIf="registerForm.get('email')?.errors?.['required']">Email zorunlu</div>
          <div *ngIf="registerForm.get('email')?.errors?.['email']">Geçerli bir email girin</div>
        </div>
      </div>

      <div>
        <label>Password</label>
        <input formControlName="password" type="password" />
        <div class="error" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid">
          <div *ngIf="registerForm.get('password')?.errors?.['required']">Şifre zorunlu</div>
          <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Şifre en az 6 karakter olmalı</div>
        </div>
      </div>

      <div>
        <label>Confirm Password</label>
        <input formControlName="confirmPassword" type="password" />
        <div class="error" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.hasError('passwordMismatch')">
          Şifreler eşleşmiyor
        </div>
      </div>

      <div class="api-error" *ngIf="apiError()">{{ apiError() }}</div>

      <button type="submit" [disabled]="registerForm.invalid">Register</button>
    </form>
  `,
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
        this.apiError.set(err?.error?.message || 'Kayıt yapılamadı');
      }
    });
  }
}
