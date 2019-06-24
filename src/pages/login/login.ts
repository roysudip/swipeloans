import { TabsPage } from './../tabs/tabs';
import { Response } from '@angular/http';
import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController } from 'ionic-angular';
import { ToastController,Platform,Events} from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
   user : any={};
   auth:any={};
   promo:any={};
   constructor(public navCtrl: NavController, public events: Events,private alertCtrl: AlertController, public navParams: NavParams, public tostCtrl:ToastController, public serviceprovider: WebserviceProvider, public utilityservice:UtilityService, public network:Network, public networkconnService:NetworkconnService, private platform: Platform) {
    //events.publish('hideHeader', { isHidden: true});
  }

  @ViewChild(Content) content: Content;
  public showNavbar: boolean;

  createUser(user) {
    console.log('User created!')
    this.events.publish('user:created', user, Date.now());
  }

  public hideNavbar(): void {
    this.showNavbar = false;
    // You should resize the content to use the space left by the navbar
    this.content.resize();
  }

  ionViewDidLoad() {

    this.setOnlineStatus();

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


  presentAuthAlert(user_details, user_token) {
    let alertAuth = this.alertCtrl.create({
      title: 'One Time Passcode (OTP)',
      message: "<p>An OTP has been sent to <strong>"+this.user.email+"</strong>.</p><p>Please enter below to verify your email address.</p><p>(don’t forget to check junk email)</p>",
      cssClass:'auth-alt',
      enableBackdropDismiss:false,
      inputs: [
        {
          name: 'auth_code',
          placeholder: '123456'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            if(data.auth_code=="" || data.auth_code==undefined){
              let alert = {message:'Please enter your OTP',duration:2500, position:'top'};
              this.messagealert(alert);
              return false;
            }else{
             this.networkconnService.checkconnection();
            if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){

              this.auth.user_token=user_token;
              this.auth.password=data.auth_code;

              this.utilityservice.showLoading();
              this.serviceprovider.checkOTP(this.auth).subscribe((Response)=>{
                this.utilityservice.hideLoading();
                if(Response.success == true){

                  if(user_details.promo_code!="" && user_details.promo_code!=undefined && user_details.promo_code!=null){
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
                  this.events.publish('loginCheck', 'Test1');

                  this.user.first_name    = '';
                  this.user.last_name     = '';
                  this.user.email         = '';

                  this.navCtrl.setRoot(TabsPage);

                  }else{

                    this.PromoCodeAlert(user_details, user_token);
                  }

                }else{
                  let alert={message:Response.message,duration:3000, position:'top'}
                  this.messagealert(alert);
                  this.presentAuthAlert(user_details, user_token);
                  return false;
                }

              },(error)=>{
                this.utilityservice.hideLoading();
                let alert={message:'Server is not working.',duration:3000, position:'top'}
                this.messagealert(alert);
                this.presentAuthAlert(user_details, user_token);
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
    alertAuth.present();
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
                  this.events.publish('loginCheck', 'Test1');

                  this.user.first_name    = '';
                  this.user.last_name     = '';
                  this.user.email         = '';

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



                  this.events.publish('loginCheck', 'Test1');

                  this.user.first_name    = '';
                  this.user.last_name     = '';
                  this.user.email         = '';

                  this.navCtrl.setRoot('DashboardPage');

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

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
   }

   validateName(name) {
    var re =  /^[A-Za-z0-9' ]*$/;
    return re.test(String(name));
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

  logForm(){

    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){

     var i=0;
     if(this.user.first_name == '' || this.user.first_name == undefined){
       let alert = {message:'Enter first name',duration:3000};
       this.messagealert(alert);
       i++;
     }
     else if(!this.validateName(this.user.first_name)){
        let alert = {message:'Special characters are not allowed on first name',duration:3000};
        this.messagealert(alert);
        i++;
    }
     else if(this.user.last_name == '' || this.user.last_name == undefined){
        let alert = {message:'Enter last name',duration:3000};
        this.messagealert(alert);
        i++;
     }
     else if(!this.validateName(this.user.last_name)){
        let alert = {message:'Special characters are not allowed on last name',duration:3000};
        this.messagealert(alert);
        i++;
       }
     else if(this.user.email == '' || this.user.email == undefined){
      let alert = {message:'Enter email address',duration:3000};
      this.messagealert(alert);
      i++;
    }
    else if(!this.validateEmail(this.user.email.trim())){
        let alert = {message:'Please enter valid email address',duration:3000};
        this.messagealert(alert);
        i++;
    }else if(this.user.promo_code){
      if((this.user.promo_code.length<4) ||  (this.user.promo_code.length>12)){
        let alert = {message:'Promo Code should be 4 to 12 character',duration:3000};
        this.messagealert(alert);
        i++;
    }
  }





    if(i==0){
      this.user.user_type = 'custom';
      let emailaddress = this.user.email;
      this.user.email=this.user.email.trim();
      this.user.email = emailaddress.toLowerCase();
      this.user.deviceToken=localStorage.getItem('deviceToken');


      this.utilityservice.showLoading();
      this.serviceprovider.signup(this.user).subscribe((Response)=>{

        if(Response.success == false){
          let alert={message:Response.message,duration:3000}
          this.messagealert(alert);
          this.utilityservice.hideLoading();
        }
        else if(Response.success == true){

          if(Response.user_details.user_status==0 || Response.user_details.user_status==null || Response.user_details.user_status==undefined || Response.user_details.user_status==''){



            // localStorage.setItem('first_name', Response.user_details.first_name);
            // localStorage.setItem('last_name', Response.user_details.last_name);
            // localStorage.setItem('email', Response.user_details.email);
            // localStorage.setItem('_id', Response.user_details._id);
            // localStorage.setItem('user_token', Response.user_token);
            // localStorage.setItem('profileimage', Response.user_details.profileimage);
            // localStorage.setItem('phone_number', Response.user_details.phone_number);
            // localStorage.setItem('dob', Response.user_details.dob);
            // localStorage.setItem('address', Response.user_details.address);


            this.utilityservice.hideLoading();

            console.log('Response', Response)

             this.presentAuthAlert(Response.user_details, Response.user_token);
          }



        }
      },(error)=>{

          this.utilityservice.hideLoading();
          let alert={message:'Server is not working.',duration:3000}
      this.messagealert(alert);

      });

      //alert(this.user.fname);
     }

    }
    else{
      let alert={message:'Internet connection is not available',duration:3000}
      this.messagealert(alert);
    }

  }

  goToSignUp(){
    this.presentAuthAlert('asdsad','asdsadsa');
  }

}
