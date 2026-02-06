import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth-service';
import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../interfaces/User';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css' 
})

export class Navbar implements OnInit{

  private router = inject(Router);
  private auth = inject(AuthService);

  connected?:boolean;
  currentUser?:User;

  ngOnInit() { 
    this.connected = !this.auth.isTokenExpired() && !!this.auth.getToken();
    this.currentUser = this.auth.getUser();
  }

  logout(){

    let confirmation = confirm("Are you sure to deconnect ?");
    if(confirmation){
    this.auth.logout().subscribe(()=>{
      this.connected = false;
    });
    }
  }


}
