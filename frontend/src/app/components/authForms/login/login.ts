import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../../core/services/auth/auth-service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports:[RouterModule,CommonModule,FormsModule],
  templateUrl: './login.html'
})
export class Login implements OnInit{

  credentials = { email: '', password: '' };
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
   this.credentials.email = (this.auth.LoggedUser!=null)?this.auth.LoggedUser:'';
  }

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) return;

    this.loading = true;
    this.error = null;

    this.auth.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed';
      }
    });
  }
}
