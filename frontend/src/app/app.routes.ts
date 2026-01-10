import { Component } from '@angular/core';
import { Routes } from '@angular/router';


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


];
