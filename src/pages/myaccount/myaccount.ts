import { Response } from '@angular/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';

import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';

import { ToastController, Platform, Events} from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

/**
 * Generated class for the MyaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
  providers: [Camera,FileTransfer,File]
})

export class MyaccountPage {
    promo: any={};
    profile: any={};
    dob
    month
    fullmonths
    day
    fullyear:any=new Date();
    public token = localStorage.getItem('user_token');
    message:any;
    notifications:any;
    deleteNotifcation:any={};
    notificationSize:number=0;
    unreadMsg:number=0;
    base_url=this.serviceprovider.getBaseURL();
    constructor(public navCtrl: NavController, public events: Events, public navParams: NavParams, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController, private camera: Camera, private transfer: FileTransfer, private file: File,  public utilityservice:UtilityService, public network:Network, public networkconnService:NetworkconnService, public platform: Platform) {
        this.dob = new Date().toJSON().split('T')[0];
           var currentTime = new Date();

            if((currentTime.getMonth() + 1)<10){
                 this.month = '0'+(currentTime.getMonth() + 1);
            }
            else{
                this.month = currentTime.getMonth() + 1;
            }

            // returns the day of the month (from 1 to 31)
                this.day = currentTime.getDate()

            // returns the year (four digits)
            //this.year = currentTime.getFullYear();**/
              var dbv=new Date().toISOString();
            this.fullyear =new Date(currentTime.getFullYear(), +'0'+currentTime.getMonth(),  currentTime.getDate()-1).toISOString();

            //this.fullyear=dbv;
            console.log(this.fullyear);
    }

    ionViewWillEnter(){

      this.getMyNotifications();

      console.log(localStorage);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MyaccountPage');
        this.getuserprofiledetails();

       this.setOnlineStatus();

         if(localStorage.getItem('loan_amt') != ''){
            localStorage.removeItem('loan_amt');
         }

         if(localStorage.getItem('loan_type') != ''){
            localStorage.removeItem('loan_type');
         }
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

    //public date: string = new Date().toISOString();

 uploadProfilePic(){

//     const options: CameraOptions = {
//         quality: 100,
//   destinationType: this.camera.DestinationType.NATIVE_URI,
//   encodingType: this.camera.EncodingType.JPEG,
//   mediaType: this.camera.PictureSourceType.PHOTOLIBRARY
//       }

      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: this.camera.EncodingType.JPEG,
        allowEdit: false,
        targetWidth: 512,
        targetHeight: 512,
        };

      let uploadoptions: FileUploadOptions = {
        fileKey: 'image',
        fileName: 'saq.jpg',
        mimeType : "image/jpeg",
        httpMethod : "POST",
        chunkedMode: false
     }

      const fileTransfer: FileTransferObject = this.transfer.create();

     this.camera.getPicture(options).then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64:
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.profile.profileimage = imageData;
        console.log('image upload',imageData);

         fileTransfer.upload(imageData, this.base_url+'/api/user/edit-profile-image?token='+this.token, uploadoptions)
            .then((data) => {
              console.log('success',data);
            }, (err) => {
                console.log(err);
         });
      }, (err) => {
       // Handle error
       console.log(err);

      });

 }

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: alert.duration,
      position: 'bottom',
      cssClass: "toastcss",
    });
    toast.present();
  }

  diseases = [
    { title: "Update Account Details", id:'tab1' },
    { title: "Update Promo Code",  id:'tab2'}
  ];

  shownGroup = 0;

     toggleGroup(group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        } else {
            this.shownGroup = group;
        }
    };
    isGroupShown(group) {
        return this.shownGroup === group;
    };

    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
     }

     validateName(name) {
      var re =  /^[A-Za-z0-9' ]*$/;
      return re.test(String(name));
     }

    // get profile data
    getuserprofiledetails(){
        //console.log(localStorage.getItem('user_token'));
        // console.log('hererere');
        this.networkconnService.checkconnection();

        if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){

            this.profile.user_token = localStorage.getItem('user_token');
            this.profile.user_id    = localStorage.getItem('_id');

            this.serviceprovider.getprofiledetails(this.profile).subscribe((Response)=>{
            //console.log(Response);
            if(Response.success == false){
            let alert= {message:Response.message,duration:3000}
            this.messagealert(alert);
            }
            else if(Response.success == true){

                this.profile = Response.user_details;

                console.log('profile', JSON.stringify(this.profile));
            }
            },(error)=>{
              let alert={message:'Server not working',duration:3000}
              this.messagealert(alert);
            });

        }
        else{
            let alert={message:'Internet connection is not available',duration:3000}
            this.messagealert(alert);
        }
    }

    vaidationphnumber(phnumber){
        var re = /06([0-9]{8})/;
        return re.test(String(phnumber));
    }

    isValidMobile(phnumber){

        let regExp = /^[0-9]{10}$/;

        if (!regExp.test(phnumber.value)) {
            return {"invalidMobile": true};
        }
        return null;
    }

    // upadte profile data

        updateprofiledetails(){

            this.networkconnService.checkconnection();

            if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){

            this.profile.user_token = localStorage.getItem('user_token');

            let str = this.profile.phone_number;

                var i=0;
                if(this.profile.first_name == '' || this.profile.first_name == undefined){
                let alert = {message:'enter first name',duration:3000};
                this.messagealert(alert);
                i++;
                } else if(!this.validateName(this.profile.first_name)){
                  let alert = {message:'Special characters are not allowed on first name',duration:3000};
                  this.messagealert(alert);
                  i++;
              }

                else if(this.profile.last_name == '' || this.profile.last_name == undefined){
                    let alert = {message:'enter last name',duration:3000};
                    this.messagealert(alert);
                    i++;
                } else if(!this.validateName(this.profile.last_name)){
                  let alert = {message:'Special characters are not allowed on last name',duration:3000};
                  this.messagealert(alert);
                  i++;
              }

                else if(this.profile.email == '' || this.profile.email == undefined){
                let alert = {message:'enter email address',duration:3000};
                this.messagealert(alert);
                i++;
                }

                else if(!this.validateEmail(this.profile.email)){

                    let alert = {message:'Please enter valid email address',duration:3000};
                    this.messagealert(alert);
                    i++;

                }
                 else if((str.toString().length<6) ||  (str.toString().length>15)){
                         let alert = {message:'Phone number should be 6 to 15 character',duration:3000};
                         this.messagealert(alert);
                         i++;
                 }else if(this.profile.promo_code.length && (this.profile.promo_code.length<4) ||  (this.profile.promo_code.length>12)){
                  let alert = {message:'Promo Code should be 4 to 12 character',duration:3000};
                  this.messagealert(alert);
                  i++;
              }

                if(i==0){
                this.profile.user_id = localStorage.getItem('_id');
                this.utilityservice.showLoading();

                this.serviceprovider.updateprofiledata(this.profile).subscribe((Response)=>{
                    console.log(Response);
                    if(Response.success == false){
                    let alert={message:Response.message,duration:3000}
                    this.messagealert(alert);
                    this.utilityservice.hideLoading();
                    }
                    else if(Response.success == true){

                        let alert={message:Response.message,duration:3000}
                        this.messagealert(alert);
                        this.utilityservice.hideLoading();

                        localStorage.setItem('first_name', Response.user_details.first_name);
                        localStorage.setItem('last_name', Response.user_details.last_name);
                        localStorage.setItem('email', Response.user_details.email);
                        localStorage.setItem('_id', Response.user_details._id);
                        localStorage.setItem('profileimage', Response.user_details.profileimage);
                        localStorage.setItem('phone_number', Response.user_details.phone_number);
                        localStorage.setItem('dob', Response.user_details.dob);
                        localStorage.setItem('address', Response.user_details.address);
                    }
                },(error)=>{
                    console.log(error);
                    this.utilityservice.hideLoading();
                });

                //alert(this.user.fname);
                }
            }
            else{
                let alert={message:'Internet connection is not available',duration:3000}
                this.messagealert(alert);
            }

        }

        UpdatePromoCode(){
          this.networkconnService.checkconnection();

            if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){

              var i=0;
              if(this.profile.promo_code == '' || this.profile.promo_code == undefined){
              let alert = {message:'Please enter promo code',duration:3000, position:'bottom'};
              this.messagealert(alert);
              i++;
              }else if((this.profile.promo_code.length<4) ||  (this.profile.promo_code.length>12)){
                let alert = {message:'Promo Code should be 4 to 12 character',duration:3000};
                this.messagealert(alert);
                i++;
            }

              if(i==0){
                this.promo.user_token = localStorage.getItem('user_token');
                this.promo.promo_code=this.profile.promo_code;

                this.utilityservice.showLoading();

                this.serviceprovider.updatepromocode(this.promo).subscribe((Response)=>{
                  console.log('Response', JSON.stringify(Response));
                  this.utilityservice.hideLoading();
                    if(Response.success == false){
                    let alert={message:Response.message,duration:3000}
                    this.messagealert(alert);

                    }
                    else if(Response.success == true){

                        let alert={message:Response.message,duration:3000}
                        this.messagealert(alert);

                       // localStorage.setItem('promo_code', Response.user_details.first_name);

                    }

                },(error)=>{

                    this.utilityservice.hideLoading();
                    let alert={message:'Server is not working.',duration:3000}
                        this.messagealert(alert);
                });
              }

          }else{
            let alert={message:'Internet connection is not available',duration:3000}
            this.messagealert(alert);

          }

        }

        getMyNotifications(){
          this.networkconnService.checkconnection();

          if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
           {

           this.token=localStorage.getItem('user_token');
           this.serviceprovider.getMynotification(this.token).subscribe((Response)=>{

            if(Response.success == false){
              let alert={message:Response.message,duration:3000}
                    this.messagealert(alert);
            }
            else if(Response.success == true){

              this.notifications=Response.notification_details;
                    var j=0;
                  for(var i=0; i<Response.notification_details.length; i++){
                    if(Response.notification_details[i].checkstatus=='false'){

                      j +=1;

                    }
                  }

                  this.unreadMsg=j;

              }
          },(error)=>{

              let alert={message:error,duration:3000}
                    this.messagealert(alert);
          });

           }else{

            let alert={message:'Internet connection not available.',duration:3000}
            this.messagealert(alert);
           }

        }

        GotoNotificationPage(){
          this.navCtrl.push('NotificationsPage')
        }

    ///// REFRESH BUTTON ////
    doRefresh(refresher) {
       this.getuserprofiledetails();
       this.getMyNotifications();
       this.setOnlineStatus();
       setTimeout(() => {
         console.log('Async operation has ended');
         refresher.complete();
       }, 2000);
    }

}
