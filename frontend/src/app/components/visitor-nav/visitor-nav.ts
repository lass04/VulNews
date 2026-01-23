import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../core/services/auth/auth-service';
import { Component, OnInit } from '@angular/core';
import { AdminSpaceRoutingModule } from "../../admin-space/admin-space-routing-module";

@Component({
  selector: 'app-visitor-nav',
  imports: [AdminSpaceRoutingModule,CommonModule],
  templateUrl: './visitor-nav.html',
  styleUrl: './visitor-nav.css', 
})

export class VisitorNav implements OnInit{

  constructor(private authSvc:AuthService,private router:Router){}

  connected : boolean= false;

  ngOnInit() {
    this.connected = this.authSvc.isAuthenticated.value;
    console.log(this.authSvc.isAuthenticated.value);
  }

  logout(){
    this.authSvc.logout().subscribe(()=>{
      this.connected = false;
      this.router.navigate(['/']);
    });
  }


}
