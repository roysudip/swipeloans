import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyBorrowPage } from './my-borrow';

@NgModule({
  declarations: [
    MyBorrowPage,
  ],
  imports: [
    IonicPageModule.forChild(MyBorrowPage),
  ],
})
export class MyBorrowPageModule {}
