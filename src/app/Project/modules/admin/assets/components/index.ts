import { AddComponentComponent } from './add-component/add-component.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { CostComponent } from './cost/cost.component';
import { DocumentsComponent } from './documents/documents.component';
import { FilterSearchComponent } from './filter-search/filter-search.component';
import { FiltersComponent } from './filters/filters.component';
import { MouldAssociationsComponent } from './mould-associations/mould-associations.component';
import { MouldDetailsComponent } from './mould-details/mould-details.component';
import { MouldTableComponent } from './mould-table/mould-table.component';
import { OtherInformationComponent } from './other-information/other-information.component';
import { SelectComponentComponent } from './select-component/select-component.component';
import { SensormasterTableComponent } from './sensormaster-table/sensormaster-table.component';
import { SparemasterTableComponent } from './sparemaster-table/sparemaster-table.component';

export const assetsComponents = [
  MouldTableComponent,
  AddComponentComponent,
  SelectComponentComponent,
  BasicDetailsComponent,
  FiltersComponent,
  MouldAssociationsComponent,
  MouldDetailsComponent,
  CostComponent,
  OtherInformationComponent,
  DocumentsComponent,
  SparemasterTableComponent,
  SensormasterTableComponent,
  FilterSearchComponent,
];

export * from './mould-table/mould-table.component';

export * from './select-component/select-component.component';
