import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorMainPageComponent } from '../containers/vendor-main-page/vendor-main-page.component';
import { OrganisationMainPageComponent } from '../containers/organisation-main-page/organisation-main-page.component';
import { LocationTableComponent } from '../components/location-table/location-table.component';
import { FacilitiesTableComponent } from '../components/facilities-table/facilities-table.component';


const routes: Routes = [
  {path:'vendor-management',component:VendorMainPageComponent},
  {path:'organisation',component:OrganisationMainPageComponent},
  {path:'location',component:LocationTableComponent},
  {path:'facilities',component:FacilitiesTableComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgsetupRoutingModule { }
