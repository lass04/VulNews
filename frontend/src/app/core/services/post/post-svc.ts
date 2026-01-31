import { Post } from '../../../interfaces/Post';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PostService {

  private readonly BASE_URL = 'http://localhost:2004/posts';

  constructor(private http: HttpClient) {}

  createPost(data: any) {
    return this.http.post(`${this.BASE_URL}/create`, data);
  }

  updatePost(id: string, data: any) {
    return this.http.patch(`${this.BASE_URL}/update/${id}`, data);
  }

  deletePost(id: string) {
    return this.http.delete(`${this.BASE_URL}/delete/${id}`);
  }

  getPosts() {
    return this.http.get<{data:Post[]}>(`${this.BASE_URL}/getAll`);
  }

  getLikedPosts(userId:string){
    return this.http.get<{data:Post[]}>(`${this.BASE_URL}/LikedPosts`);
  }

  LikePost(userId:string,postId:string){
    return this.http.post<any>(`${this.BASE_URL}/LikePost/${userId}`,{postId:postId});
  }

}
