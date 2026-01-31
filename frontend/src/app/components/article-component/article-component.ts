import { Navbar } from './../navbar/navbar';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../core/services/article/article-svc';
import { Component } from '@angular/core';
import { Article } from '../../interfaces/Article';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-component',
  imports: [Navbar,DatePipe,CommonModule],
  templateUrl: './article-component.html',
  styleUrl: './article-component.css',
})
export class ArticleComponent {


  article!: Article;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private articleSvc: ArticleService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.articleSvc.getArticleById(id).subscribe(res => {
        this.article = res.data;
        this.loading = false;
      });
    }
  }
}



