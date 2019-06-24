import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAuthenticatePage } from './user-authenticate';

@NgModule({
  declarations: [
    UserAuthenticatePage,
  ],
  imports: [
    IonicPageModule.forChild(UserAuthenticatePage),
  ],
})
export class UserAuthenticatePageModule {}
