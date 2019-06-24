import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { ToastController, Platform } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import YouTubePlayer from 'youtube-player';
import { UtilityService } from '../../providers/webservice/utility';
/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

  faq: any={};
  youtubevideoid: any;
  showimage: boolean;
  user_faq:any='';
  UserToken='';
  constructor(public navCtrl: NavController, public sanitizer:DomSanitizer, public navParams: NavParams, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController, public network:Network, public networkconnService:NetworkconnService, public platform: Platform, public utilityservice:UtilityService,) {
  }

  ionViewDidLoad() {
    this.UserToken=localStorage.getItem('user_token');
    this.getfaqcontent();
    this.setOnlineStatus();

    if(localStorage.getItem('loan_amt') != ''){
      localStorage.removeItem('loan_amt');
    }

    if(localStorage.getItem('loan_type') != ''){
      localStorage.removeItem('loan_type');
    }

  }

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'toastcss'
    });
    toast.present();
  }



  shownGroup = null;

    toggleGroup(group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
            this.showimage=false;
        } else {
            this.shownGroup = group;
            this.showimage=false;
        }
    };
    isGroupShown(group) {
        return this.shownGroup === group;
    };

    public setOnlineStatus(): void {

      this.platform.ready().then(() => {
          this.checkConnection();
      });
  }

  public checkConnection(): void {

      var networkState = navigator.connection.type;

      localStorage.setItem('network_connection', networkState);

  }


    getfaqcontent(){

      this.networkconnService.checkconnection();

      if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
       {
          this.faq.slug = 'about_us';
          let faqArray = [];
          this.serviceprovider.getfaqcontent(this.faq).subscribe((Response)=>{
            if(Response.success == false){
                  console.log(Response);
                  let alert={message:Response.message,duration:3000}
                  this.messagealert(alert);
            }
            else if(Response.success == true){
              //console.log(Response.faq);
                  for(let f=0; f<Response.faq.length; f++){
                      //console.log(Response.faq[f])
                      var gene=Response.faq[f].youtube;

                // var genemp4=Response.loan.loan_video;
                //var mp4newurl = genemp4.replace("watch?v=",'embed/');
                var uid=gene.split("=");
                //console.log(uid);
                var youtubevideoid=uid[1]
                //console.log(uid[1])
                var youtubeimage='https://i1.ytimg.com/vi/'+uid[1]+'/0.jpg'
                var newURl=gene.replace("watch?v=",'embed/')

                var youtubeimg = this.sanitizer.bypassSecurityTrustResourceUrl(youtubeimage);
                      faqArray.push({question:Response.faq[f].question, id:Response.faq[f]._id, youtube:youtubeimg, youtubevideoid:youtubevideoid, ans:Response.faq[f].answer, tab:'tab'+Response.faq[f]._id});
                  }
                  this.faq.faq_content = faqArray;

            }
          },
          (error)=>{
            console.log(error);
          });
      }
      else{
        let alert={message:'Internet connection is not available',duration:3000}
        this.messagealert(alert);
      }

      }



 // open you tube video
 openvideo(url,fid){
  localStorage.debug = 'youtube-player:*';

  this.showimage=true;

  let player;

  player =new YouTubePlayer('video-player'+fid);
  player.loadVideoById(url);
  //player.playVideo();

}

SendUserFaqQuestion(){
  this.networkconnService.checkconnection();
  var i=0;
  if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){
    if(!this.UserToken){
      let alert={message:'No user found',duration:3000}
      this.messagealert(alert);
    }else if(this.user_faq=='' || this.user_faq==undefined || this.user_faq==null){
      let alert={message:'Please add your question.',duration:3000}
      this.messagealert(alert);
      }else{
        let UserData:any={};
        UserData.user_faq=this.user_faq
        this.utilityservice.showLoading();
        this.serviceprovider.SendUserFaqQuestion(UserData, this.UserToken).subscribe((Response)=>{
          this.utilityservice.hideLoading();
          if(Response.success == false){
          let alert= {message:Response.message,duration:3000}
          this.messagealert(alert);
          }
          else if(Response.success == true){
            this.utilityservice.hideLoading();
           this.user_faq='';

            let alert={message:'Successfully sent your question.',duration:3000}
            this.messagealert(alert);
          }
          },(error)=>{
            this.utilityservice.hideLoading();
            let alert={message:'Server not working',duration:3000}
            this.messagealert(alert);
          });

      }


  }else{
    let alert={message:'Internet connection is not available',duration:3000}
            this.messagealert(alert);
  }
}

}
