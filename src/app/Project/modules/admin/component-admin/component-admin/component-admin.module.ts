import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentAdminRoutingModule } from './component-admin-routing.module';
import { componentsAdmin } from '../components';
import { ShareModule } from 'src/app/Project/shared/share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ...componentsAdmin
  ],
  imports: [
    CommonModule,
    ComponentAdminRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports:[
    ...componentsAdmin,
  ]
})
export class ComponentAdminModule { }
