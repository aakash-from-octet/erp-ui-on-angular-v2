import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductMainPageComponent } from '../containers/product-main-page/product-main-page.component';
import { ComponentMainPageComponent } from '../containers/component-main-page/component-main-page.component';
import { BrandComponent, CategoryComponent } from '../../component-admin/components';

const routes: Routes = [
   { path: 'brand', component: BrandComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'product', component: ProductMainPageComponent },
  { path: 'component', component: ComponentMainPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
