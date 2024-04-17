import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { productsContainer } from '../containers';
import { productsComponents } from '../components';
import { ShareModule } from 'src/app/Project/shared/share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [...productsContainer, ...productsComponents],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ShareModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [...productsContainer, ...productsComponents],
})
export class ProductsModule {}
