import { Tool } from '../../../interfaces/Tool';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToolService {

  private readonly BASE_URL = 'http://localhost:2004/tools';

  constructor(private http: HttpClient) {}

  createTool(data: any) {
    return this.http.post(`${this.BASE_URL}/create`, data);
  }

  updateTool(id: string, data: any) {
    return this.http.patch(`${this.BASE_URL}/update/${id}`, data);
  }

  deleteTool(id: string) {
    return this.http.delete(`${this.BASE_URL}/delete/${id}`);
  }

  getTools() {
    return this.http.get<{data: Tool[]}>(`${this.BASE_URL}/getAll`);
  }

  insertManyTools(data: any[]) {
    return this.http.post(`${this.BASE_URL}/insertMany`, data);
  }

  getToolsByCatId(cat:string) {
    return this.http.get<{data: Tool[]}>(`${this.BASE_URL}/getByCategory/${cat}`);
  }

  getToolById(id:string) {
    return this.http.get<{data:Tool}>(`${this.BASE_URL}/getById/${id}`);
  }

}

