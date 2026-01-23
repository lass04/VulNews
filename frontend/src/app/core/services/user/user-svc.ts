import { User } from '../../../interfaces/User';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly BASE_URL = 'http://localhost:2004/users';

  constructor(private http: HttpClient) {}

  createUser(data: any) {
    return this.http.post(`${this.BASE_URL}/create`, data);
  }

  updateUser(id: string, data: any) {
    return this.http.patch(`${this.BASE_URL}/update/${id}`, data);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.BASE_URL}/delete/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.BASE_URL}/getAll`);
  }

}

