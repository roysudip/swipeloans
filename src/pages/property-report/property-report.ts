import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController,Platform } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';

import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';

import { AlertController } from 'ionic-angular';

/**
 * Generated class for the PropertyReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-property-report',
  templateUrl: 'property-report.html',
})
export class PropertyReportPage {
  prop: any={};
  UserPhone=null;
  User: any={};
  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public networkconnService:NetworkconnService, public utilityservice:UtilityService, public navParams: NavParams, public tostCtrl: ToastController,public serviceprovider:WebserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PropertyReportPage');
    this.getuserphnumber();

    if(localStorage.getItem('loan_amt') != ''){
      localStorage.removeItem('loan_amt');
   }

   if(localStorage.getItem('loan_type') != ''){
      localStorage.removeItem('loan_type');
   }

   this.UserPhone=localStorage.getItem('phone_number');

  }

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: alert.duration,
      position: alert.position,
      cssClass: "toastcss"
    });
    toast.present();
  }

  PhoneNumberAlert() {
    let alert = this.alertCtrl.create({
      title: 'We need your mobile number please',
      cssClass:'PhnAlt',
      inputs: [
        {
          name: 'phonenumber',
          placeholder: 'Eg. 9876543210',
          type:'number',
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
          text: 'Add',
          handler: data => {
            if (data.phonenumber) {

             if((data.phonenumber.toString().length<6) ||  (data.phonenumber.toString().length>15)){
              let alert= {message:'Phone number should be 6 to 15 character',duration:3000, position:'top'}
              this.messagealert(alert);
              return false;

              }else{
              this.utilityservice.showLoading();
              this.networkconnService.checkconnection();

              if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
               {
                this.prop.phone_number=data.phonenumber;
                this.serviceprovider.SaveYourPhonenumber(this.prop).subscribe((Response)=>{
                  console.log(Response);
                  this.utilityservice.hideLoading();


                if(Response.success == false){

                  let alert= {message:Response.message,duration:3000}
                  this.messagealert(alert);
                }
                else if(Response.success == true){
                  localStorage.setItem('phone_number', data.phonenumber);

                  this.UserPhone= localStorage.getItem('phone_number');
                  data='';
                    }
                },(error)=>{
                  let alert= {message:'Server not working.',duration:3000}
                  this.messagealert(alert);
                });

              }
               else{
                let alert= {message:'Internet not available',duration:3000, position:'bottom'}
                this.messagealert(alert);

               }

              }

            } else {
              let alert= {message:'Please enter Phone number',duration:3000, position:'top'}
              this.messagealert(alert);
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  getuserphnumber(){
    this.prop.user_id    = localStorage.getItem('_id');
    this.prop.user_token = localStorage.getItem('user_token');

    if(this.prop.user_id != ''){
      this.serviceprovider.getprofiledetails(this.prop).subscribe((Response)=>{
        console.log(Response);
      if(Response.success == false){
        // this.utilityservice.hideLoading();
        // let alert= {message:Response.message,duration:3000}
        // this.messagealert(alert);
      }
      else if(Response.success == true){
              if(Response.user_details.phone_number==0){
                this.prop.report_ph= "";
                this.prop.user_name= Response.user_details.first_name+' '+Response.user_details.last_name;
                this.prop.user_email= Response.user_details.email;
              }
              else{
                this.prop.report_ph= Response.user_details.phone_number;
                this.prop.user_name= Response.user_details.first_name+' '+Response.user_details.last_name;
                this.prop.user_email= Response.user_details.email;
              }

              // let alert= {message:'Property report has been successfully send',duration:3000}
              // this.messagealert(alert);
              // this.prop.report_address = '';
              // this.prop.report_ph= ;
              // this.prop.report_description = '';
              // this.utilityservice.hideLoading();
          }
      },(error)=>{
            console.log(error);
      });
    }

  }

  sendproprtyreport(){
    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
     {
     let phnum  = this.prop.report_ph;
     var i=0;
      console.log(this.UserPhone);
     if(this.UserPhone == '' || this.UserPhone == undefined || this.UserPhone==null || this.UserPhone==0){
      this.PhoneNumberAlert();
      i++;
    } else if(this.prop.report_address  == '' || this.prop.report_address == undefined){
        let alert= {message:'Please enter address',duration:3000}
        this.messagealert(alert);
        i++;
      }



    if(i==0){
      this.utilityservice.showLoading();
      this.prop.user_token = localStorage.getItem('user_token');
      this.prop.user_idfk    = localStorage.getItem('_id');
      this.prop.report_ph=this.UserPhone;
      this.serviceprovider.sendpropertyreport(this.prop).subscribe((Response)=>{
        console.log(Response);
      if(Response.success == false){
        this.utilityservice.hideLoading();
        let alert= {message:Response.message,duration:3000}
        this.messagealert(alert);
      }
      else if(Response.success == true){
             // let alert= {message:'Property report has been successfully send',duration:3000}
             // this.messagealert(alert);
              this.prop.report_address = '';
              this.prop.report_ph = '';
              this.utilityservice.hideLoading();

              let ThankYouMsg='Thanks for your request, we are now generating your report, keep an eye on your email!';


              this.navCtrl.push("ThankYouPage", {'ThankYouMsg':ThankYouMsg});
          }
      },(error)=>{
        let alert= {message:'Server not working.',duration:3000}
        this.messagealert(alert);
      });

    }

  }else{
    let alert= {message:'Internet not available',duration:3000}
    this.messagealert(alert);

  }


  }



}
