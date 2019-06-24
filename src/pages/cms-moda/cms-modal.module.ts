import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CmsModalPage } from './cms-modal';

@NgModule({
  declarations: [
    CmsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CmsModalPage),
  ],
})
export class CmsModalPageModule {}
