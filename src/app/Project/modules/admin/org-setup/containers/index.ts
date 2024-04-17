import { FacilitiesTableComponent } from '../components/facilities-table/facilities-table.component';
import { OrganisationMainPageComponent } from './organisation-main-page/organisation-main-page.component';
import { VendorMainPageComponent } from './vendor-main-page/vendor-main-page.component';

export const orgsetupContainer = [
  VendorMainPageComponent,
  OrganisationMainPageComponent,
  FacilitiesTableComponent,
];

export * from './organisation-main-page/organisation-main-page.component';
export * from './vendor-main-page/vendor-main-page.component';
// export * from '../components/facilities-table/facilities-table.component'
