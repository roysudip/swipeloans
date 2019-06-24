import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoandetailsPage } from './loandetails';
import { EmbedVideoService } from 'ngx-embed-video';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { Base64 } from '@ionic-native/base64';
import { SocialSharing } from '@ionic-native/social-sharing/';
@NgModule({
  declarations: [
    LoandetailsPage,

  ],
  imports: [
    IonicPageModule.forChild(LoandetailsPage),
    BrMaskerModule,

  ],
  providers:[EmbedVideoService, SocialSharing]
})
export class LoandetailsPageModule {}
