import { Component, ViewChild} from '@angular/core';
import { IonicPage,AlertController, NavController, NavParams, Content, MenuController,ModalController, LoadingController} from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { ToastController,Platform } from 'ionic-angular';
import { UtilityService } from '../../providers/webservice/utility';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { HttpClient } from '@angular/common/http';
import {CmsModalPage} from '../cms-moda/cms-modal';
import { TabsPage } from '../tabs/tabs';


/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var navigator: any;
declare var Connection: any;

@IonicPage()

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userData: any={};
  twitdata: any={};
page: any={};
  pagecontent: any={};
  //public twitdata: any={};
  reference:any="";
  FbPromocode:any;
  promo:any={};
  message:any='';
  constructor(public navCtrl: NavController,private alertCtrl: AlertController, public http: HttpClient, public navParams: NavParams, private fb: Facebook, private menu: MenuController, public serviceprovider: WebserviceProvider, public tostCtrl:ToastController, public utilityservice:UtilityService, public network:Network, public networkconnService:NetworkconnService,private platform: Platform,public tw: TwitterConnect,public loadingCtrl: LoadingController, private modal:ModalController) {



  }

  @ViewChild(Content) content: Content;
  public showNavbar: boolean;


  public hideNavbar(): void {

    this.showNavbar = false;
    // You should resize the content to use the space left by the navbar
    this.content.resize();

  }

  ionViewDidEnter() {

    if(this.navParams.get('message')){
      this.message=this.navParams.get('message');
      let alert={message:this.message,duration:3000, position:'bottom'}
      this.messagealert(alert);
    }
    this.menu.swipeEnable(false);
    this.reference=this.navParams.get('reference');

    if(this.reference=='notifications'){

      let alert={message:'Please login to view your notifications',duration:2000};
              this.messagealert(alert);
    }

    if(localStorage.getItem('user_token')){
      this.navCtrl.setRoot(TabsPage)
    }
  }

  ionViewDidLoad() {
    this.setOnlineStatus();
    console.log('token,', localStorage.getItem('user_token'));
    console.log(localStorage.getItem("deviceToken"));

  }

  PromoCodeAlert(user_details, user_token) {
    let promoalert = this.alertCtrl.create({
      title: 'Please Enter Promo Code',
      cssClass:'promo-alt',
      enableBackdropDismiss:false,
      inputs: [
        {
          name: 'promo_code',
          placeholder: 'XV5gt7'
        },

      ],
      buttons: [
        {
          text: "I don’t have one",
          role: 'cancel',
          handler: data => {

            localStorage.setItem('first_name', user_details.first_name);
                  localStorage.setItem('last_name', user_details.last_name);
                  localStorage.setItem('email', user_details.email);
                  localStorage.setItem('_id', user_details._id);
                  localStorage.setItem('user_token', user_token);
                  localStorage.setItem('profileimage', user_details.profileimage);
                  localStorage.setItem('phone_number', user_details.phone_number);
                  localStorage.setItem('dob', user_details.dob);
                  localStorage.setItem('address', user_details.address);
                  if(user_details.promo_code){
                    localStorage.setItem('promo_code', user_details.promo_code);

                  }

                  this.navCtrl.setRoot(TabsPage);
          }
        },
        {
          text: 'Continue',
          handler: data => {
            if(data.promo_code=="" || data.promo_code==undefined){
              let alert = {message:'Please enter promo code',duration:2500, position:'top'};
              this.messagealert(alert);
              return false;
            } else if((data.promo_code.length<4) ||  (data.promo_code.length>12)){
              let alert = {message:'Promo Code should be 4 to 12 character',duration:2500, position:'top'};
              this.messagealert(alert);
              return false;
            }else{
             this.networkconnService.checkconnection();
            if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){

              this.promo.user_token=user_token;
              this.promo.promo_code=data.promo_code;

              console.log('promo_req', this.promo);
              this.utilityservice.showLoading();
              this.serviceprovider.updatepromocode(this.promo).subscribe((Response)=>{
                console.log('promo_res',Response);
                this.utilityservice.hideLoading();
                if(Response.success == true){


                  localStorage.setItem('first_name', user_details.first_name);
                  localStorage.setItem('last_name', user_details.last_name);
                  localStorage.setItem('email', user_details.email);
                  localStorage.setItem('_id', user_details._id);
                  localStorage.setItem('user_token', user_token);
                  localStorage.setItem('profileimage', user_details.profileimage);
                  localStorage.setItem('phone_number', user_details.phone_number);
                  localStorage.setItem('dob', user_details.dob);
                  localStorage.setItem('address', user_details.address);

                  //  localStorage.setItem('promo_code', this.promo.promo_code);

                  this.navCtrl.setRoot(TabsPage);

                }else{
                  let alert={message:Response.message,duration:3000, position:'top'}
                  this.messagealert(alert);
                  this.PromoCodeAlert(user_details, user_token);
                  return false;
                }

              },(error)=>{
                this.utilityservice.hideLoading();
                let alert={message:'Server is not working.',duration:3000, position:'top'}
                this.messagealert(alert);
                this.PromoCodeAlert(user_details, user_token);
                return false;

            });

            }else{
              let alert = {message:'Internet connection is not working',duration:2500, position:'top'};
              this.messagealert(alert);
              return false

            }




          }
          }
        }
      ]
    });
    promoalert.present();
  }



  opensignin(){
    this.navCtrl.push("LoginPage"); //DeepLink navigation
  }


  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: alert.duration,
      position: alert.position,
      cssClass: 'toastcss'
    });
    toast.present();
  }



  public setOnlineStatus(): void {

    this.platform.ready().then(() => {
        this.checkConnection();


    });
}

public checkConnection(): void {

    var networkState = navigator.connection.type;

    localStorage.setItem('network_connection', networkState);

}

    fblogin(){

      this.networkconnService.checkconnection();
       if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){
        //this.utilityservice.showLoading();


        this.fb.login(['public_profile', 'email'])
        .then((res: FacebookLoginResponse) => {

          if(res.status == "connected"){

            this.fb.api('/me?fields=id,email,first_name,last_name,picture.width(720).height(720).as(picture_large)&access_token=' + res.authResponse.accessToken, null)
            .then((response: any) => {

            let fbuser = {
            fbId: response.id,
            name: response.name,
            email: response.email,
            accessToken:res.authResponse.accessToken,
            //picture : "http://graph.facebook.com/" + res.authResponse.userID + "/picture?type=large",
            latitude : localStorage.getItem('search_lat'),
            longitude : localStorage.getItem('search_long'),
            device_token:localStorage.getItem('deviceToken'),
            };
            this.userData.user_type = 'facebook';
            this.userData.first_name=response.first_name;
            this.userData.last_name= response.last_name;
            this.userData.email=response.email;
            this.userData.picture=response['picture_large']['data']['url'];
            this.userData.fbId=response.id;
            this.userData.accessToken=res.authResponse.accessToken;
            this.userData.deviceToken=localStorage.getItem('deviceToken');

           /************************************************/
            console.log('fb-request', JSON.stringify(this.userData));

           this.serviceprovider.signup(this.userData).subscribe((Response)=>{

            console.log('facebook response', JSON.stringify(Response));
              if(Response.success == false){
                let alert={message:Response.message,duration:3000}
                this.messagealert(alert);
               // this.utilityservice.hideLoading();
              }
              else if(Response.success == true){


                if(Response.user_details.promo_code!="" && Response.user_details.promo_code!=undefined && Response.user_details.promo_code!=null){
                console.log('facebook response', JSON.stringify(Response));
                 localStorage.setItem('first_name', Response.user_details.first_name);
                 localStorage.setItem('last_name', Response.user_details.last_name);
                 localStorage.setItem('email', Response.user_details.email);
                 localStorage.setItem('_id', Response.user_details._id);
                 localStorage.setItem('user_token', Response.user_token);
                 localStorage.setItem('profileimage', Response.user_details.profileimage);
                 localStorage.setItem('phone_number', Response.user_details.phone_number);
                 localStorage.setItem('dob', Response.user_details.dob);
                 localStorage.setItem('address', Response.user_details.address);
                  localStorage.setItem('promo_code', Response.user_details.promo_code);

                  this.navCtrl.setRoot(TabsPage); //DeepLink navigation
              }else{

                this.PromoCodeAlert(Response.user_details, Response.user_token);
              }

              }else{
                  let alert={message:Response.message,duration:3000};
              this.messagealert(alert);
              }
            },(error)=>{
                let alert={message:'Server not working',duration:3000};
              this.messagealert(alert);
            });



          });
        }
        })
        .catch(e => console.log('Error logging into Facebook', e));

        //this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);


      }
      else{
        let alert={message:'Internet connection is not available',duration:3000}
        this.messagealert(alert);
      }


    }


    // twitter login

    /*doTwLogin(){
      let twitdata: any;


      let nav = this.navCtrl;

      let env = this;
      //Request for login
      this.tw.login().then(function(result) {
        console.log(JSON.stringify(env.tw.showUser()));
        env.tw.showUser().then(function(user){
          console.log('sudip');
          console.log(JSON.stringify(user));

        }, function(error){
          console.log(JSON.stringify(result));

        });
      },function(error){
        console.log(JSON.stringify(error));

      });

    }

    doTwLogin(){
      let env = this;
      this.tw.login(
        function(result) {
          console.log('Successful login!');
          console.log(JSON.stringify(result));

          env.tw.showUser(
            function(user) {
              console.log('User Profile:');
              console.log(JSON.stringify(user));

              console.log('Twitter handle :'+result.userName);
            }, function(error) {
              console.log('Error retrieving user profile');
              console.log(JSON.stringify(error));
            }
          );


        }, function(error) {
          console.log('Error logging in');
          console.log(JSON.stringify(error));
        }
      )
    }*/

    OpenPrivacyPolicy(){

      this.networkconnService.checkconnection();
      if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){
      this.page.slug = '5ac309ebf79267618c854383';
      this.serviceprovider.getcontentdata(this.page).subscribe((Response)=>{
        if(Response.success == false){
          console.log(Response);
          let alert={message:Response.message,duration:3000}
          this.messagealert(alert);
        }
        else if(Response.success == true){
             // this.content.about_us = Response.cms.content;
              //this.openModal( Response.cms.content);
          if(Response.cms.content && Response.cms.content!=undefined && Response.cms.content!=null){
            this.pagecontent.title=Response.cms.title;
            this.pagecontent.content=Response.cms.content;
            this.openModal( this.pagecontent);

          }

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


    OpenTermsCond(){

      this.networkconnService.checkconnection();
      if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){
      this.page.slug = '5ac30a00f79267618c854384';
      this.serviceprovider.getcontentdata(this.page).subscribe((Response)=>{
        if(Response.success == false){
          let alert={message:Response.message,duration:3000}
          this.messagealert(alert);
        }
        else if(Response.success == true){
          console.log( Response.cms);
          if(Response.cms.content && Response.cms.content!=undefined && Response.cms.content!=null){

            this.pagecontent.title=Response.cms.title;
            this.pagecontent.content=Response.cms.content;
            this.openModal( this.pagecontent);

          }

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



    openModal(CmsContent){

      const myModal = this.modal.create('CmsModalPage',  { CmsContent: CmsContent });

      myModal.present();

      myModal.onDidDismiss((data) => {
        this.navCtrl.setRoot("HomePage");
      });

      myModal.onWillDismiss((data) => {


      });
      }



}
