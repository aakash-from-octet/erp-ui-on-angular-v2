import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RolepermissionsMainPageComponent } from '../containers/rolepermissions-main-page/rolepermissions-main-page.component';
import { UsersMainPageComponent } from '../containers/users-main-page/users-main-page.component';
import { RolesMainPageComponent } from '../containers/roles-main-page/roles-main-page.component';

const routes: Routes = [
  { path: 'role-permission', component: RolepermissionsMainPageComponent },
  { path: 'roles', component: RolesMainPageComponent },
  { path: 'users', component: UsersMainPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersetupRoutingModule {}
