import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PropertyReportPage } from './property-report';

@NgModule({
  declarations: [
    PropertyReportPage,
  ],
  imports: [
    IonicPageModule.forChild(PropertyReportPage),
  ],
})
export class PropertyReportPageModule {}
