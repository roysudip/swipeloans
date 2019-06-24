import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterItemPage } from './filter-item';

@NgModule({
  declarations: [
    FilterItemPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterItemPage),
  ],
})
export class FilterItemPageModule {}
