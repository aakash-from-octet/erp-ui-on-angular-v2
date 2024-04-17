import { AddTaskComponent } from './add-task/add-task.component';

import { DocumentsComponent } from './documents/documents.component';
import { TaskGroupTableComponent } from './task-group-table/task-group-table.component';
import { SelectComponentComponent } from './select-component/select-component.component';
import { IssueCodeTableComponent } from './issue-code-table/issue-code-table.component';
import { TemplaterepositoryTableComponent } from './template-repository-table/template-repository-table.component';
import { TaskrepositoryTableComponent } from './task-repository-table/task-repository-table.component';
import { MscTableComponent } from './msc-table/msc-table.component';
import { LocationTreeComponent } from './location-tree/location-tree.component';

export const repositoryComponents = [
  TaskGroupTableComponent,
  AddTaskComponent,
  SelectComponentComponent,
  DocumentsComponent,
  IssueCodeTableComponent,
  TemplaterepositoryTableComponent,
  TaskrepositoryTableComponent,
  MscTableComponent,
  LocationTreeComponent,
];

export * from './task-group-table/task-group-table.component';
export * from './select-component/select-component.component';
export * from './location-tree/location-tree.component';
