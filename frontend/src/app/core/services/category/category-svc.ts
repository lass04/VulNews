import { Category } from '../../../interfaces/Category';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly BASE_URL = 'http://localhost:2004/categories';

  constructor(private http: HttpClient) {}

  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create`, data);
  }

  updateCategory(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.BASE_URL}/update/${id}`, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/delete/${id}`);
  }

  getCategories(limit?:number){
    return this.http.get<{data:Category[]}>(`${this.BASE_URL}/getAll?limit=${limit}`);
  }

  insertManyCategories(data: any[]): Observable<any> {
    return this.http.post(`${this.BASE_URL}/insertMany`, data);
  }

  getCategoryByName(category:String){
    return this.http.get<{data:Category}>(`${this.BASE_URL}/getByName?category=${category}`);
  }
  
}

