import { User } from './../../../interfaces/User';
import { jwtDecode } from "jwt-decode";
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })

export class AuthService {

  private readonly BASE_URL = 'http://localhost:2004/auth';

  private http = inject(HttpClient);
  private router = inject(Router);

  public LoggedUser?:string|null;
  public isAuthenticated =new BehaviorSubject<boolean>(false);
  

  constructor(){
    //if(this.isTokenExpired())
      //this.removeToken();
  }

  signup(data:any){
    return this.http.post<any>(`${this.BASE_URL}/register`,data).pipe(
      tap((data:any)=>{
        this.LoggedUser = data.email;
      }
    ));
  }

  login(data:any){
    return this.http.post<any>(`${this.BASE_URL}/login`,data,{withCredentials:true}).pipe(
      tap((resData:any)=>{
        this.doLoginUser(data,resData);
      }
      ));
      
  }

  doLoginUser(data:any,resData:any){
    this.LoggedUser = data.email;
    this.storeUser(resData.user);
    this.storeToken(resData.accessToken);
    this.isAuthenticated.next(true);
  }

  logout(){
    return this.http.post<any>(`${this.BASE_URL}/logout`,{}).pipe(
      tap(()=>{

        this.removeToken();
        this.removeUser();

        this.LoggedUser=null;
        this.isAuthenticated.next(false);
        this.router.navigate(['/']);
      }));
  }

  removeToken(){
    localStorage.removeItem("token");
  }

  storeToken(token:any){
    localStorage.setItem("token",token);
  }

  getToken(){
    return localStorage.getItem("token");
  }

  storeUser(user:User){
    localStorage.setItem("user",JSON.stringify(user));
  }

  getUser(){
    const user = localStorage.getItem("user");
    
    if(user){
      return JSON.parse(user);
   }
  }

  removeUser(){
    localStorage.removeItem("user");
  }

  refresh(){
    
    return this.http.post<any>(`${this.BASE_URL}/refresh`,{},{ withCredentials:true}).pipe(
      tap((token:any)=> {
        this.isAuthenticated.next(true);
        this.storeToken(token.accessToken);
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
