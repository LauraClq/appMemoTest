import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage
  },  {
    path: 'facil',
    loadChildren: () => import('./facil/facil.module').then( m => m.FacilPageModule)
  },
  {
    path: 'medio',
    loadChildren: () => import('./medio/medio.module').then( m => m.MedioPageModule)
  },
  {
    path: 'dificil',
    loadChildren: () => import('./dificil/dificil.module').then( m => m.DificilPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
