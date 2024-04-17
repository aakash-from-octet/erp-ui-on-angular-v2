import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersetupRoutingModule } from './usersetup-routing.module';
import { usersetupContainer } from '../containers';
import { usersetupComponents } from '../components';
import { ShareModule } from 'src/app/Project/shared/share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [...usersetupContainer, ...usersetupComponents],
  imports: [CommonModule, UsersetupRoutingModule, ShareModule,ReactiveFormsModule,
    FormsModule,],
  exports: [...usersetupContainer, ...usersetupComponents],
})
export class UsersetupModule {}
