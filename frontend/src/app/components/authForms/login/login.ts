import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../../core/services/auth/auth-service';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports:[RouterModule,CommonModule,FormsModule],
  templateUrl: './login.html'
})
export class Login {
  credentials = { email: '', password: '' };
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) return;

    this.loading = true;
    this.error = null;

    this.auth.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']); // redirect after login
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed';
      }
    });
  }
}
