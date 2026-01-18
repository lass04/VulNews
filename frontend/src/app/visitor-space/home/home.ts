import { Tool } from './../../interfaces/Tool';
import { Post } from './../../interfaces/Post';
import { Category } from './../../interfaces/Category';
import { Article } from './../../interfaces/Article';
import { ToolService } from './../../services/tool/tool-svc';
import { PostService } from './../../services/post/post-svc';
import { CategoryService } from './../../services/category/category-svc';
import { ArticleService } from './../../services/article/article-svc';

import { VisitorNav } from '../../components/visitor-nav/visitor-nav';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSpaceRoutingModule } from "../../admin-space/admin-space-routing-module";

@Component({
  selector: 'app-visitor-home',
  standalone: true,
  imports: [CommonModule, VisitorNav, AdminSpaceRoutingModule],
  templateUrl: './home.html'
})
export class Home implements OnInit {

  articles: Article[] = [];
  categories: Category[] = [];
  posts: Post[] = [];
  tools: Tool[] = [];

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
      this.articles = res.data;
    });
    this.categoryService.getCategories(10).subscribe(res => {
      this.categories = res.data;
    });
    this.postService.getPosts().subscribe(res => {
      this.posts = res.data;
    });
    this.toolService.getTools().subscribe(res => {
      this.tools = res.data;
    });

    setTimeout(() => this.loading = false, 800);

    console.log(this.articles,this.tools,this.categories);
  }

}