import { jwtDecode } from "jwt-decode";
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })

export class AuthService {

  private readonly BASE_URL = 'http://localhost:2004/auth';

  private http = inject(HttpClient);
  private router = inject(Router);

  public LoggedUser?:string|null;
  public isAuthenticated =new BehaviorSubject<boolean>(false);
  

  constructor(){}

  signup(data:any){
    return this.http.post<any>(`${this.BASE_URL}/register`,data).pipe(
      tap((data:any)=>{
        this.LoggedUser = data.email;
      }
    ));
  }

  login(data:any){
    return this.http.post<any>(`${this.BASE_URL}/login`,data).pipe(
      tap((token:any)=>{
        this.doLoginUser(data,JSON.stringify(token.accessToken));
      }
      ));
      
  }

  doLoginUser(data:any,token:any){
    this.LoggedUser = data.email;
    this.storeToken(token);
    this.isAuthenticated.next(true);
  }

  logout(){
    localStorage.removeItem("token");
    this.LoggedUser=null;
    this.isAuthenticated.next(false);
    return this.http.post<any>(`${this.BASE_URL}/logout`,{});
  }

  storeToken(token:any){
    localStorage.setItem("token",token);
  }

  getToken(){
    return localStorage.getItem("token");
  }

  refresh(){
    
    return this.http.post<any>(`${this.BASE_URL}/refresh`,{},{ withCredentials:true}).pipe(
      tap((AccToken:any)=> {
        this.isAuthenticated.next(true);
        this.storeToken(AccToken)
      }
      )
    )
  }

  isTokenExpired(){

    const token = this.getToken();
    if(!token) return true;

    const decoded = jwtDecode(token);
    if(!decoded.exp) return true;

    var exp = decoded.exp * 1000;
    const now = new Date().getTime();

    return exp < now;
  }

}
