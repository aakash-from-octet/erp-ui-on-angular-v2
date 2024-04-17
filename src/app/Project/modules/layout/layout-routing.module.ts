import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

const routes: Routes = [
  // {path:'',redirectTo:'home',pathMatch:'full'},
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('../admin/org-setup/orgsetup/orgsetup.module').then(
            (m) => m.OrgsetupModule
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('../admin/user-management/usersetup/usersetup.module').then(
            (m) => m.UsersetupModule
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('../admin/products/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import(
            '../admin/component-admin/component-admin/component-admin.module'
          ).then((m) => m.ComponentAdminModule),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('../admin/assets/assets/assets.module').then(
            (m) => m.AssetsModule
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('../admin/repository/repository/repository.module').then(
            (m) => m.RepositoryModule
          ),
      },
      {
        path: 'home',
        loadChildren: () =>
          import('../home_module/home/home.module').then((m) => m.HomeModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
