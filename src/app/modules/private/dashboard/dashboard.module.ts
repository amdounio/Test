import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../../shared/shared.module';
import { SportsListComponent } from './sports-list/sports-list.component';
import { HomeComponent } from './home/home.component';
import { MatchsComponent } from './matchs/matchs.component';
import { SliderComponent } from './slider/slider.component';
import { BackgroundsComponent } from './backgrounds/backgrounds.component';
import { MediaComponent } from './media/media.component';
import { ProfilComponent } from './profil/profil.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SportsListComponent,
    HomeComponent,
    MatchsComponent,
    SliderComponent,
    BackgroundsComponent,
    MediaComponent,
    ProfilComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
