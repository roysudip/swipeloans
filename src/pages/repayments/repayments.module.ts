import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RepaymentsPage } from './repayments';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    RepaymentsPage,
  ],
  imports: [
    IonicPageModule.forChild(RepaymentsPage),
    BrMaskerModule
  ],
})
export class RepaymentsPageModule {}
