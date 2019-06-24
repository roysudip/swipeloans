import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { BrMaskerModule } from 'brmasker-ionic-3';
@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    BrMaskerModule
  ],
})
export class DashboardPageModule {}
