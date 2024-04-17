import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrgsetupRoutingModule } from './orgsetup-routing.module';
import { orgsetupContainer } from '../containers';
import { orgsetupComponents } from '../components';
import { ShareModule } from 'src/app/Project/shared/share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ...orgsetupContainer,
    ...orgsetupComponents
  ],
  imports: [
    CommonModule,
    OrgsetupRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports:[
    ...orgsetupContainer,
    ...orgsetupComponents
  ]
})
export class OrgsetupModule { }
