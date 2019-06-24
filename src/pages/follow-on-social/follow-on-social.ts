import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { UtilityService } from '../../providers/webservice/utility';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { ToastController } from 'ionic-angular';
import { AppAvailability } from '@ionic-native/app-availability';
@IonicPage()
@Component({
  selector: 'page-follow-on-social',
  templateUrl: 'follow-on-social.html',
})
export class FollowOnSocialPage {
  user_token='';
  FollowUsData:any={};
  FbApp:any;
  LinkedInAPP:any;
  InstaAPP:any;
  YoutubeApp:any;
  constructor(public navCtrl: NavController,public utilityservice:UtilityService,  public navParams: NavParams, public network:Network, public networkconnService:NetworkconnService, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController,
    private appAvailability: AppAvailability,
    private platform: Platform
  ) {

    if (this.platform.is('ios')) {
      this.FbApp = 'fb://';
      this.InstaAPP = 'instagram://';
      this.LinkedInAPP='linkedin://';
    } else if (this.platform.is('android')) {
      this.FbApp = 'com.facebook.katana';
      this.InstaAPP = 'com.instagram.android';
      this.LinkedInAPP='com.linkedin.android';
    }

  }


  ionViewDidLoad() {
   if(localStorage.getItem('user_token')){
    this.user_token=localStorage.getItem('user_token')
   }
   this.getSocialLink();
  }

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: 3000,
      position: 'middle',
      cssClass: 'toastcss'
    });
    toast.present();
  }

  getSocialLink(){
      if(!this.user_token){
        let alert= {message:'User token not found.',duration:3000}
        this.messagealert(alert);
      }else{
        this.networkconnService.checkconnection();

        if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){

          this.utilityservice.showLoading();
          this.serviceprovider.getSocialLinkURLService(this.user_token).subscribe((Response)=>{

            console.log(Response)
            if(Response.success == false){
             let alert= {message:Response.message,duration:3000}
             this.messagealert(alert);
             this.utilityservice.hideLoading();
            }
            else if(Response.success == true && Response.data){
              if(Response.data[0]){
                this.FollowUsData=Response.data[0];
              }

               this.utilityservice.hideLoading();

            }
       },(error)=>{
          console.log(error);
       });

        }else{
          let alert= {message:'No internet connection available.',duration:3000}
        this.messagealert(alert);
        }
      }
  }
  FolllowFacebook(){
    this.appAvailability.check(this.FbApp)
  .then(
    (yes: boolean) => {
      window.open('fb://page/'+this.FollowUsData.facebook_link, '_system')
    },
    (no: boolean) => {
     // window.open('https://play.google.com/store/apps/details?id=com.facebook.katana', '_system')

     window.open('https://www.facebook.com/'+this.FollowUsData.facebook_link, '_system')
    }
  );

  }

  FolllowLinkedIn(){
    this.appAvailability.check(this.LinkedInAPP)
    .then(
      (yes: boolean) => {
        window.open(this.FollowUsData.linkedin_link, '_system')
      },
      (no: boolean) => {
       // window.open('https://play.google.com/store/apps/details?id=com.linkedin.android', '_system')

       window.open(this.FollowUsData.linkedin_link, '_system')
      }
    );
  }

  FolllowInsta(){

    this.appAvailability.check(this.InstaAPP)
    .then(
      (yes: boolean) => {
        window.open(this.FollowUsData.instagram_link, '_system')
      },
      (no: boolean) => {
       // window.open('https://play.google.com/store/apps/details?id=com.instagram.android', '_system')
       window.open(this.FollowUsData.instagram_link, '_system')
      }
    );

  }

  FolllowYoutube(){
    if(this.FollowUsData && this.FollowUsData.youtube_link){
      window.open(this.FollowUsData.youtube_link, '_system')
    }
  }
}
