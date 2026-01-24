import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../core/services/auth/auth-service';
import { Component, OnInit, inject } from '@angular/core';
import { AdminSpaceRoutingModule } from "../../admin-space/admin-space-routing-module";

@Component({
  selector: 'app-visitor-nav',
  imports: [AdminSpaceRoutingModule,CommonModule],
  templateUrl: './visitor-nav.html',
  styleUrl: './visitor-nav.css', 
})

export class VisitorNav implements OnInit{

  private router = inject(Router);
  private auth = inject(AuthService);

  connected?:boolean;

  ngOnInit() { 
    this.connected = !this.auth.isTokenExpired() && !!this.auth.getToken();
  }

  logout(){
    this.auth.logout().subscribe(()=>{
      this.connected = false;
      this.router.navigate(['/']);
    });
  }


}
