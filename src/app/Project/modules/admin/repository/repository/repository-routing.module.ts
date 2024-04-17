import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskgroupMainPageComponent } from '../containers/taskgroup-main-page/taskgroup-main-page.component';
import { IssuecodeMainPageComponent } from '../containers/issuecode-main-page/issuecode-main-page.component';
import { TemplateRepositoryMainPageComponent } from '../containers/template-repository-main-page/template-repository-main-page.component';
import { TaskrepositoryMainPageComponent } from '../containers/task-repository-main-page/task-repository-main-page.component';
import { MscMainPageComponent } from '../containers/msc-main-page/msc-main-page.component';

const routes: Routes = [
  { path: 'task-group', component: TaskgroupMainPageComponent },
  { path: 'issue-code', component: IssuecodeMainPageComponent },
  {
    path: 'template-repository',
    component: TemplateRepositoryMainPageComponent,
  },
  {
    path: 'task-repository',
    component: TaskrepositoryMainPageComponent,
  },
  {
    path: 'maintenance-schedule-configuration',
    component: MscMainPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepositoryRoutingModule {}
