import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MouldMainPageComponent } from '../containers/mould-main-page/mould-main-page.component';
import { SparemasterMainPageComponent } from '../containers/sparemaster-main-page/sparemaster-main-page.component';
import { SensormasterMainPageComponent } from '../containers/sensormaster-main-page/sensormaster-main-page.component';

const routes: Routes = [
  { path: 'mould', component: MouldMainPageComponent },
  { path: 'spare-master', component: SparemasterMainPageComponent },
  { path: 'sensor-master', component: SensormasterMainPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsRoutingModule {}
