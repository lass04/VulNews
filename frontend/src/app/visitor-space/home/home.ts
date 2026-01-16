import { ToolService } from './../../services/tool/tool-svc';
import { PostService } from './../../services/post/post-svc';
import { CategoryService } from './../../services/category/category-svc';
import { ArticleService } from './../../services/article/article-svc';

import { VisitorNav } from './../visitor-nav/visitor-nav';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visitor-home',
  standalone: true,
  imports: [CommonModule,VisitorNav],
  templateUrl: './home.html'
})
export class Home implements OnInit {

  articles: any[] = [];
  categories: any[] = [];
  posts: any[] = [];
  tools: any[] = [];

  loading = true;

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private postService: PostService,
    private toolService: ToolService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.articleService.getArticles().subscribe(res => {
      this.articles = Array.isArray(res) ? res : Object.values(res);
    });
    this.categoryService.getCategories().subscribe(res => {
      this.categories = Array.isArray(res) ? res : Object.values(res);
    });
    this.postService.getPosts().subscribe(res => {
      this.posts = Array.isArray(res) ? res : Object.values(res);
    });
    this.toolService.getTools().subscribe(res => {
      this.tools = Array.isArray(res) ? res : Object.values(res);
    });

    setTimeout(() => this.loading = false, 800);

    console.log(this.articles,this.tools,this.categories);
  }

}