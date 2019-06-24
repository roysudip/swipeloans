import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController} from 'ionic-angular';

import { WebserviceProvider } from '../../providers/webservice/webservice';
import { ToastController, Platform} from 'ionic-angular';
import { UtilityService } from '../../providers/webservice/utility';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';

declare var window:any;
declare var navigator: any;
declare var Connection: any;


@IonicPage({
  segment:'page-bookappoinment'
})

@Component({
  selector: 'page-book-appooinment',
  templateUrl: 'book-appooinment.html',
})
export class BookAppooinmentPage {

  BookApt : any={};
  loan : any={};
 loan_title : any={};
 lender_id: any={};
 lender_name:any={};
 UserPhone=null;
 MaxYear:any;
 minYear:any;
today:any;
StateList:any=[];
  constructor(public navCtrl: NavController,private alertCtrl: AlertController, public navParams: NavParams, private menu: MenuController, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController,public utilityservice:UtilityService, public network:Network, public networkconnService:NetworkconnService, private platform: Platform) {
    var currentTime = new Date();
    this.today=new Date().toISOString();

    //this.minYear=new Date(currentTime.getFullYear(), +'0'+currentTime.getMonth()+0,  currentTime.getDate()+1).toISOString();

   //this.MaxYear =new Date(currentTime.getFullYear(), +'0'+currentTime.getMonth()+0,  currentTime.getDate()+14).toISOString();
   this.minYear=this.DayAddRemove(0);
   this.MaxYear=this.DayAddRemove(14);
  }

  ionViewDidLoad() {
    this.getaProductLender();
    this.getStateList();
    this.UserPhone= localStorage.getItem('phone_number');
    if(localStorage.getItem('phone_number')){
      this.BookApt.PhoneNumber=this.UserPhone;
    }
  }

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: alert.duration,
      position: 'bottom',
      cssClass: "toastcss"
    });

    toast.present();
  }

  getStateList(){

  this.networkconnService.checkconnection();

  if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
   {
  let token = localStorage.getItem('user_token');
if(token){
  this.serviceprovider.getStateList(token).subscribe((Response)=>{

    if(Response.success == false){
      let alert = {message:'Unable to get the loan details. Please try again later',duration:3000};
            this.messagealert(alert);
    }
    else if(Response.success == true){
     this.StateList=Response.data;

     console.log(this.StateList.length)
      }
  },(error)=>{
      console.log(error);
   //   this.utilityservice.hideLoading();
  });
}

}
  else{
    let alert={message:'Internet connection is not available',duration:3000}
    this.messagealert(alert);
  }
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
                this.BookApt.phone_number=data.phonenumber;
                this.BookApt.user_token = localStorage.getItem('user_token');


                this.serviceprovider.SaveYourPhonenumber(this.BookApt).subscribe((Response)=>{

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

  public setOnlineStatus(): void {
    this.platform.ready().then(() => {
        this.checkConnection();
    });
}

public checkConnection(): void {
    var networkState = navigator.connection.type;
    localStorage.setItem('network_connection', networkState);
}


getaProductLender(){

  this.networkconnService.checkconnection();

  if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
   {
  this.loan.user_token = localStorage.getItem('user_token');
  this.loan.loan_id = this.navParams.get('loanid');
    if(this.navParams.get('loanid')){
      this.serviceprovider.showloandetails(this.loan).subscribe((Response)=>{

        if(Response.success == false){
          let alert = {message:'Unable to get the loan details. Please try again later',duration:3000};
                this.messagealert(alert);
        }
        else if(Response.success == true){

          this.loan_title = Response.loan.loan_title;
           this.lender_id=Response.loan.lender._id;
           this.lender_name=Response.loan.lender.lender;

           this.BookApt.product=this.loan_title;

           this.BookApt.lender=this.lender_name;
           this.BookApt.lenderId=this.lender_id;

          }
      },(error)=>{
          console.log(error);
       //   this.utilityservice.hideLoading();
      });
    }
 // this.utilityservice.showLoading();

}
  else{
    let alert={message:'Internet connection is not available',duration:3000}
    this.messagealert(alert);
  }
 }
  SubmitBookAppointment(){

    this.UserPhone= localStorage.getItem('phone_number');
    this.BookApt.user_token = localStorage.getItem('user_token');
    this.BookApt.user_id = localStorage.getItem('_id');
    if(this.navParams.get('loanid')){
      this.BookApt.loan_id = this.navParams.get('loanid');
    }
    var dataResult = [];
       if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
       {

          var i=0;

          if(this.UserPhone == '' || this.UserPhone == undefined || this.UserPhone==null || this.UserPhone==0){
            this.PhoneNumberAlert();            i++;
          }else if(this.BookApt.ConfType =='' || this.BookApt.ConfType ==undefined){
            let alert = {message:'Please select Conference type',duration:3000};
            this.messagealert(alert);
            i++;
          }
          else if(this.BookApt.UserState=='' || this.BookApt.UserState==undefined){
            let alert = {message:'Please select your state.',duration:3000};
           this.messagealert(alert);
            i++;
          }

          else if(this.BookApt.ApptDateTime=='' || this.BookApt.ApptDateTime==undefined){
            let alert = {message:'Please enter your meeting date & time.',duration:3000};
           this.messagealert(alert);
            i++;

          }

          else if(this.BookApt.ConfType=='video' && (this.BookApt.VideoType=='' || this.BookApt.VideoType==undefined)){
            let alert = {message:'Please select any medium Skype or Whatsapp.',duration:3000};
           this.messagealert(alert);
            i++;

          }
          else if(this.BookApt.ConfType=='video' && this.BookApt.VideoType!="" && this.BookApt.VideoType!=undefined) {
            if(this.BookApt.VideoType=='skype' && (this.BookApt.SkypeId=="" || this.BookApt.SkypeId==undefined)){
              let alert = {message:'Please enter your skype ID.',duration:3000};
           this.messagealert(alert);
            i++;
            }else if(this.BookApt.VideoType=='whatsapp' && (this.BookApt.WhatsappId=="" || this.BookApt.WhatsappId==undefined)){
              let alert = {message:'Please enter your Whatsapp ID.',duration:3000};
           this.messagealert(alert);
            i++;
            } else if(this.BookApt.VideoType=='whatsapp' && this.BookApt.WhatsappId!="" && (this.BookApt.WhatsappId.length<6 ||  this.BookApt.WhatsappId.length>15)){

              let alert = {message:'Please enter your valid Whatsapp ID.',duration:3000};
              this.messagealert(alert);
               i++;
            }
      }

    else if(this.BookApt.ConfType=='phone') {

      if(this.BookApt.PhoneNumber!="" && this.BookApt.PhoneNumber!=undefined){
        if(this.BookApt.PhoneNumber.length<6 ||  this.BookApt.PhoneNumber.length>15){
          let alert = {message:'Phone number must be greater than 6 and less than 15',duration:3000};
          this.messagealert(alert);
          i++;
        }
      }else{

        let alert = {message:'Please enter your phone number',duration:3000};
          this.messagealert(alert);
          i++;
      }
}

          if(i==0){
           this.BookApt.UserState=this.BookApt.UserState.trim();


            this.utilityservice.showLoading();
            this.serviceprovider.BookAppoinment(this.BookApt).subscribe((Response)=>{
              this.utilityservice.hideLoading();
              if(Response.success == false){
                let alert={message:Response.message,duration:3000}
                this.messagealert(alert);

              }
              else if(Response.success == true){
                this.BookApt={};

                let ThankYouMsg='You have successfully submitted your appointment. We look forward to talking with you soon. ';


                this.navCtrl.push("ThankYouPage", {'ThankYouMsg':ThankYouMsg});
              }
            },(error)=>{

                this.utilityservice.hideLoading();

                let alert={message:'Server not working',duration:3000}
                this.messagealert(alert);
            });

         }

        }
        else{
          let alert={message:'Internet connection is not available',duration:3000}
          this.messagealert(alert);
        }
  }


  DayAddRemove(day, type = "+") {
    var todayTimeStamp = +new Date(); // Unix timestamp in milliseconds

    var oneDayTimeStamp = 1000 * 60 * 60 * 24 * day; // Milliseconds in a day

    if (type == "-") {
      var diff = todayTimeStamp - oneDayTimeStamp;
    } else {
      var diff = todayTimeStamp + oneDayTimeStamp;
    }

    var dateDate = new Date(diff);
    var dateString =
      dateDate.getFullYear() +
      "-" +
      ("0" + (dateDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + dateDate.getDate()).slice(-2);

    return dateString;
  }

   ///// REFRESH BUTTON ////
   doRefresh(refresher) {
    //this.getaProductLender();
    this.setOnlineStatus();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
 }



}



