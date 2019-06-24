import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ToastController,Platform,Events} from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  user: any={};
  constructor(public navCtrl: NavController, public events: Events, public navParams: NavParams, public tostCtrl:ToastController, public serviceprovider: WebserviceProvider, public utilityservice:UtilityService, public network:Network, public networkconnService:NetworkconnService, private platform: Platform) {
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
    console.log('ionViewDidLoad LoginPage');
    this.setOnlineStatus();
   // this.checkuserloginornot();

   console.log(JSON.stringify(localStorage.getItem('deviceToken')))
  }



  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: alert.duration,
      position: 'bottom',
      cssClass: 'toastcss'
    });
    toast.present();
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
    else if(!this.validateEmail(this.user.email)){
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
      this.user.email = emailaddress.toLowerCase();
      this.user.deviceToken=localStorage.getItem('deviceToken');

      console.log('user_data', JSON.stringify(this.user));
      this.utilityservice.showLoading();
      this.serviceprovider.signup(this.user).subscribe((Response)=>{
           console.log(JSON.stringify(Response));
        if(Response.success == false){
          let alert={message:Response.message,duration:3000}
          this.messagealert(alert);
          this.utilityservice.hideLoading();
        }
        else if(Response.success == true){

          this.events.publish('loginCheck', 'Test1');

          console.log(Response);
          // let alert={message:Response.message,duration:3000}
          // this.messagealert(alert);
          this.user.first_name    = '';
          this.user.last_name     = '';
          this.user.email         = '';
          this.user.promo_code         = '';

          localStorage.setItem('first_name', Response.user_details.first_name);
          localStorage.setItem('last_name', Response.user_details.last_name);
          localStorage.setItem('email', Response.user_details.email);
          localStorage.setItem('_id', Response.user_details._id);
          localStorage.setItem('user_token', Response.user_token);
          localStorage.setItem('profileimage', Response.user_details.profileimage);
          localStorage.setItem('phone_number', Response.user_details.phone_number);
          localStorage.setItem('dob', Response.user_details.dob);
          localStorage.setItem('address', Response.user_details.address);


          if(Response.user_details.promo_code){
            localStorage.setItem('promo_code', Response.user_details.promo_code);

          }

          this.utilityservice.hideLoading();

           //this.navCtrl.setRoot("DashboardPage"); //DeepLink navigation
           this.navCtrl.setRoot("DashboardPage"); //DeepLink navigation

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
}
