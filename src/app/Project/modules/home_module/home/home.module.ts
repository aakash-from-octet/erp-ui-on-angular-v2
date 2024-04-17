import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { homeSetupComponents } from '../components';
import { ShareModule } from 'src/app/Project/shared/share/share.module';


@NgModule({
  declarations: [...homeSetupComponents],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ShareModule
  ],
  exports:[
    ...homeSetupComponents,
  ]
})
export class HomeModule { }
