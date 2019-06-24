import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAppliedQuestionPage } from './my-applied-question';

@NgModule({
  declarations: [
    MyAppliedQuestionPage,
  ],
  imports: [
    IonicPageModule.forChild(MyAppliedQuestionPage),
  ],
})
export class MyAppliedQuestionPageModule {}
