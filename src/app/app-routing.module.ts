import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/public/login/login.component';
import { LandingComponent } from './modules/public/landing/landing.component';
import { FeaturesComponent } from './modules/public/features/features.component';
import { PlansComponent } from './modules/public/plans/plans.component';
import { FaqComponent } from './modules/public/faq/faq.component';
import { DashboardComponent } from './modules/private/dashboard-v/dashboard.component';
import { HomeComponent } from './modules/private/dashboard/home/home.component';
import { SportsListComponent } from './modules/private/dashboard/sports-list/sports-list.component';

const routes: Routes = [
  {path : '', component:LandingComponent},
  {path : 'login', component:LoginComponent},
  {path : 'features', component:FeaturesComponent},
  {path : 'plans', component:PlansComponent},
  {path : 'faq', component:FaqComponent},
  // {path : 'dashboard', component:DashboardComponent},
  // {path : 'home', component:HomeComponent},
  // {path : 'sports', component:SportsListComponent},
  { path: 'register', loadChildren: () => import('./modules/public/register/register.module').then(m => m.RegisterModule) },
  { path: 'dashboard', loadChildren: () => import('./modules/private/dashboard/dashboard.module').then(m => m.DashboardModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
