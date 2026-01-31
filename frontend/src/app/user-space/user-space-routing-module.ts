import { Profile } from './user-profile/user-profile';
import { Community } from './community/community';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path:'community', component:Community},
  { path: 'profile', component:Profile}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSpaceRoutingModule { }
