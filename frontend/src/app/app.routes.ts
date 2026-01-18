import { Tool } from './interfaces/Tool';
import { ArticleComponent } from './components/article-component/article-component';
import { CategoryComponent } from './components/category-component/category-component';
import { NotFound } from './components/not-found/not-found';
import { Signup } from './components/authForms/signup/signup';
import { Login } from './components/authForms/login/login';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { ToolComponent } from './components/tool-component/tool-component';


export const routes: Routes = [
    
    { path: '',
     loadChildren: () => import('./visitor-space/visitor-space-module').then(m => m.VisitorSpaceModule)
    },

    { path: 'user',
     loadChildren: () => import('./user-space/user-space-module').then(m => m.UserSpaceModule)
    },

    { path: 'admin',
     loadChildren: () => import('./admin-space/admin-space-module').then(m => m.AdminSpaceModule)
    },

    { path: 'login',component:Login},
    { path: 'signup', component:Signup},
    { path: 'categories/:category', component:CategoryComponent},
    { path: 'articles/:id' , component:ArticleComponent},
    { path: 'tools/:id' , component:ToolComponent},
    { path:'**',component:NotFound}

];
