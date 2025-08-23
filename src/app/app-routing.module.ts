import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Lazy load User module
  {
    path: '',
    loadChildren: () =>
      import('./views/user/user.module').then(m => m.UserModule)
  },

  // Lazy load Admin module
  {
    path: '',
    loadChildren: () =>
      import('./views/admin/admin.module').then(m => m.AdminModule)
  },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
