import { Comment } from './../../../interfaces/Comment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommentService {

  private readonly BASE_URL = 'http://localhost:2004/comments';

  constructor(private http: HttpClient) {}

  createComment(data: any) {
    return this.http.post<{data:Comment}>(`${this.BASE_URL}/create`, data);
  }

  updateComment(id: string, data: any) {
    return this.http.patch(`${this.BASE_URL}/update/${id}`, data);
  }

  deleteComment(id: string) {
    return this.http.delete(`${this.BASE_URL}/delete/${id}`);
  }

  getPostComments(postId:string) {
    return this.http.get<{data:Comment[]}>(`${this.BASE_URL}/getPostComments/${postId}`);
  }

}
