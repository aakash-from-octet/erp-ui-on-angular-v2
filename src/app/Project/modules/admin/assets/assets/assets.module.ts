import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing.module';
import { assetsContainer } from '../containers';
import { assetsComponents } from '../components';
import { ShareModule } from 'src/app/Project/shared/share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [...assetsContainer, ...assetsComponents],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [...assetsContainer, ...assetsComponents],
})
export class AssetsModule {}
