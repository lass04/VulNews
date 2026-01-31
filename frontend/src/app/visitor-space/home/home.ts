import { Navbar } from './../../components/navbar/navbar';
import { Cve } from './../../interfaces/Cve';
import { CveSvc } from '../../core/services/cve/cve-svc';
import { Tool } from './../../interfaces/Tool';
import { Post } from './../../interfaces/Post';
import { Category } from './../../interfaces/Category';
import { Article } from './../../interfaces/Article';
import { ToolService } from '../../core/services/tool/tool-svc';
import { PostService } from '../../core/services/post/post-svc';
import { CategoryService } from '../../core/services/category/category-svc';
import { ArticleService } from '../../core/services/article/article-svc';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSpaceRoutingModule } from "../../admin-space/admin-space-routing-module";

@Component({
  selector: 'app-visitor-home',
  standalone: true,
  imports: [CommonModule, Navbar, AdminSpaceRoutingModule],
  templateUrl: './home.html'
})

export class Home implements OnInit {

  articles: Article[] = [];
  categories: Category[] = [];
  posts: Post[] = [];
  tools: Tool[] = [];
  cves: Cve[] = [];

  loading = true;

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private postService: PostService,
    private toolService: ToolService,
    private cveService: CveSvc
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    
    this.loading = true;

    this.articleService.getLatestArticles("3").subscribe(res => {
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

    this.cveService.getLatestNvd("3").subscribe(res => {
      this.cves = res.data;
    });

    setTimeout(() => this.loading = false, 800);

  }

}