import { CommonModule } from '@angular/common';
import { AuthService } from './../../../core/services/auth/auth-service';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-signup',
  imports:[CommonModule,FormsModule,RouterModule],
  templateUrl: './signup.html',
})
export class Signup {
  credentials = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    
    if (!this.credentials.firstName || !this.credentials.lastName || !this.credentials.email || !this.credentials.password) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.auth.signup(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Signup failed';
      }
    });
  }
}
