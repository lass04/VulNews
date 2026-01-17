import { CategoryService } from './../../services/category/category-svc';
import { ToolService } from './../../services/tool/tool-svc';
import { ArticleService } from './../../services/article/article-svc';
import { VisitorNav } from '../visitor-nav/visitor-nav';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SlicePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-component',
  imports: [VisitorNav,SlicePipe,CommonModule],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css',
})
export class CategoryComponent implements OnInit {

  constructor(
    private ArticleSvc:ArticleService,
    private ToolSvc:ToolService,
    private CategorySvc:CategoryService,
    private actRoute:ActivatedRoute
  )
  {}

  articles:any[] = [];
  tools:any[] = [];
  currentCat:any = null;
  category:string|null = "";

  ngOnInit() {

    this.category = this.actRoute.snapshot.paramMap.get('category');
    
    if(this.category){
      this.CategorySvc.getCategoryByName(this.category).subscribe(res=>{

        this.currentCat = res.data._id;

        this.ArticleSvc.getArticlesByCatId(this.currentCat).subscribe(res => {
          this.articles = Array.isArray(res) ? res[2] : Object.values(res);
        });

        this.ToolSvc.getToolsByCatId(this.currentCat).subscribe(res => {
          this.tools = Array.isArray(res) ? res[2] : Object.values(res);
          console.log(this.tools)
        });
        
      });

    }

  }

}
