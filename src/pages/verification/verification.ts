import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';


/**
 * Generated class for the VerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
})

export class VerificationPage {
   verifyuser: any={};
  constructor(public navCtrl: NavController, public navParams: NavParams, public tostCtrl:ToastController, public webserviceprovide: WebserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerificationPage');
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

  codeverification(){
//console.log(this.verifyuser.email_verification_code);
     var i=0;
     if(this.verifyuser.email_verification_code == '' || this.verifyuser.email_verification_code == undefined){
       let alert = {message:'Enter verification code',duration:3000};
       this.messagealert(alert);
       i++;
     }

    if(i==0){

      //console.log(localStorage.getItem('email'));
      this.verifyuser.email = localStorage.getItem('email');

      this.webserviceprovide.verificationcode(this.verifyuser).subscribe((Response)=>{
           //console.log(Response);
        if(Response.success == false){
          let alert={message:Response.message,duration:3000}
          this.messagealert(alert);
        }
        else if(Response.success == true){    

          let alert={message:Response.message,duration:3000}

          this.messagealert(alert);
          
          this.verifyuser.email_verification_code    = '';
         
          this.navCtrl.setRoot("DashboardPage"); //DeepLink navigation

        }
      },(error)=>{
          console.log(error);
      });

      //alert(this.user.fname);
     }
  }

}
