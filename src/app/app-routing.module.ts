import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splah-animado',
    pathMatch: 'full',
  },
  {
    path: 'splah-animado',
    loadChildren: () =>
      import('./pages/splah-animado/splah-animado.module').then(
        (m) => m.SplahAnimadoPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'ranking',
    loadChildren: () =>
      import('./pages/ranking/ranking.module').then((m) => m.RankingPageModule),
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
