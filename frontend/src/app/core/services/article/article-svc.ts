import { Article } from '../../../interfaces/Article';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ArticleService {

  private readonly BASE_URL = 'http://localhost:2004/articles';

  constructor(private http: HttpClient) {}

  createArticle(data: any) {
    return this.http.post(`${this.BASE_URL}/create`, data);
  }

  updateArticle(id: string, data: any) {
    return this.http.patch(`${this.BASE_URL}/update/${id}`, data);
  }

  deleteArticle(id: string) {
    return this.http.delete(`${this.BASE_URL}/delete/${id}`);
  }

  getArticles(limit:string) {
    return this.http.get<{data: Article[]}>(`${this.BASE_URL}/getAll`);
  }

  getLatestArticles(limit:string){
    return this.http.get<{data:Article[]}>(`${this.BASE_URL}/getLatest?limit=${limit}`);
  }

  insertManyArticles(data: any[]) {
    return this.http.post(`${this.BASE_URL}/insertMany`, data);
  }

  getArticlesByCatId(cat:string){
    return this.http.get<{data: Article[]}>(`${this.BASE_URL}/getByCategory/${cat}`);
  }

  getArticleById(id:string){
    return this.http.get<{data:Article}>(`${this.BASE_URL}/getById/${id}`);
  }

}
