import { Navbar } from './../navbar/navbar';
import { Tool } from './../../interfaces/Tool';
import { CategoryService } from '../../core/services/category/category-svc';
import { ToolService } from '../../core/services/tool/tool-svc';
import { ArticleService } from '../../core/services/article/article-svc';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SlicePipe, CommonModule } from '@angular/common';
import { Article } from '../../interfaces/Article';

@Component({
  selector: 'app-category-component',
  imports: [Navbar, SlicePipe, CommonModule, RouterLink],
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

  articles:Article[] = [];
  tools:Tool[] = [];
  currentCat:any = null;
  category:string|null = "";

  ngOnInit() {

    this.category = this.actRoute.snapshot.paramMap.get('category');
    
    if(this.category){
      this.CategorySvc.getCategoryByName(this.category).subscribe(res=>{

        this.currentCat = res.data._id;

        this.ArticleSvc.getArticlesByCatId(this.currentCat).subscribe(res => {
          this.articles = res.data;
        });

        this.ToolSvc.getToolsByCatId(this.currentCat).subscribe(res => {
          this.tools = res.data;
        });
        
      });

    }

  }

}
