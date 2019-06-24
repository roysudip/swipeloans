import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanTypePage } from './loan-type';

@NgModule({
  declarations: [
    LoanTypePage,
  ],
  imports: [
    IonicPageModule.forChild(LoanTypePage),
  ],
})
export class LoanTypePageModule {}
