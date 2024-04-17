import { LocationTreeComponent } from '../components/location-tree/location-tree.component';
import { IssuecodeMainPageComponent } from './issuecode-main-page/issuecode-main-page.component';
import { MscMainPageComponent } from './msc-main-page/msc-main-page.component';
import { TaskrepositoryMainPageComponent } from './task-repository-main-page/task-repository-main-page.component';

import { TaskgroupMainPageComponent } from './taskgroup-main-page/taskgroup-main-page.component';
import { TemplateRepositoryMainPageComponent } from './template-repository-main-page/template-repository-main-page.component';

export const repositoryContainer = [
  TaskgroupMainPageComponent,
  LocationTreeComponent,
  IssuecodeMainPageComponent,
  TemplateRepositoryMainPageComponent,
  TaskrepositoryMainPageComponent,
  MscMainPageComponent,
];

export * from './taskgroup-main-page/taskgroup-main-page.component';

export * from '../components/location-tree/location-tree.component';
