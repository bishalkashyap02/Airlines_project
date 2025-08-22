// // views/admin/admin-routing.module.ts
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { AdminComponent } from './admin.component';
// import { AuthGuard } from '../../services/auth.guard';
// import { AdminGuard } from '../../services/admin.guard';
// import { HomeComponent } from '../home/home/home.component';

// const routes: Routes = [
//   { path: 'home', component: HomeComponent},
//   { path: '', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
//   { path: '**', redirectTo: "/home" }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class AdminRoutingModule {}
