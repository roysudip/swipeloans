import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplyLoanPage } from './apply-loan';

@NgModule({
  declarations: [
    ApplyLoanPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyLoanPage),
  ],
})
export class ApplyLoanPageModule {}
