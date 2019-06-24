import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatListingPage } from './chat-listing';

@NgModule({
  declarations: [
    ChatListingPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatListingPage),
  ],
})
export class ChatListingPageModule {}
