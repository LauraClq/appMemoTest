import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'menu',
        loadChildren: () =>
          import('../pages/menu/menu.module').then((m) => m.MenuPageModule),
      },
      {
        path: 'ranking',
        loadChildren: () =>
          import('../pages/ranking/ranking.module').then((m) => m.RankingPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/menu',
        pathMatch: 'full',
      }
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
