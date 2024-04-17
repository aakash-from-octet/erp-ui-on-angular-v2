import { AddComponentComponent } from './add-component/add-component.component';
import { ComponentTableComponent } from './component-table/component-table.component';
import { DocumentsComponent } from './documents/documents.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { SelectComponentComponent } from './select-component/select-component.component';

export const productsComponents = [
  ProductTableComponent,
  ComponentTableComponent,
  AddComponentComponent,
  SelectComponentComponent,
  DocumentsComponent,
];

export * from './product-table/product-table.component';
export * from './select-component/select-component.component';
