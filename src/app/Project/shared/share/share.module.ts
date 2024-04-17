import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareRoutingModule } from './share-routing.module';
import { NgAntDesignModule } from '../ng-ant-design/ng-ant-design.module';

import * as ShareComponents from '../containers';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ...ShareComponents.containers
  ],
  imports: [
    CommonModule,
    ShareRoutingModule,
    FormsModule,
    NgAntDesignModule,
  ],
  exports:[
    ShareRoutingModule,
    NgAntDesignModule,
    ...ShareComponents.containers
  ]
})
export class ShareModule { }
