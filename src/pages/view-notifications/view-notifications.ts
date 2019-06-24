import { NotificationsPage } from './../notifications/notifications';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController, AlertController } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';
import { ToastController,App, Platform} from 'ionic-angular';
import { Token } from '@angular/compiler';


@IonicPage({
  segment:'page-view-notifications/notification_id/:noti_id'
})
@Component({
  selector: 'page-view-notifications',
  templateUrl: 'view-notifications.html',
})
export class ViewNotificationsPage {
  noti_title="";
  noti_description="";
  notification:any={};
  datetime:any;
  NotiReplyMsg='';
  NotiDate='';
  UserId='';
  token:any;
  noti_id="";
  type='';
  notificationSize:number;
  ReplyData:any={};
  notifications:any;
  constructor(public navCtrl: NavController,  public appCtrl: App,public viewCtrl: ViewController,public utilityservice:UtilityService, public networkconnService:NetworkconnService, public navParams: NavParams, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController,
    public alertController: AlertController) {
    this.UserId=localStorage.getItem('_id');
    this.token=localStorage.getItem('user_token');
  }

  ionViewDidLoad() {
    this.type=this.navParams.get('type')

    this.updateNotificationStatus();
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

  updateNotificationStatus(){
    this.networkconnService.checkconnection();
    this.notification.token=localStorage.getItem('user_token');
    this.notification.notification_id=this.navParams.get('noti_id');

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
    {

      this.utilityservice.showLoading();
      this.serviceprovider.updateMyNotification(this.notification).subscribe((Response)=>{
       if(Response.success == true){
        this.utilityservice.hideLoading();
        this.noti_title=this.navParams.get('noti_title');
        this.noti_description=this.navParams.get('noti_description');
        this.datetime=this.navParams.get('datetime');
        this.noti_id=this.navParams.get('noti_id');

        if(Response.reply_message && Response.reply_message[0]){
          this.NotiReplyMsg=Response.reply_message[0].reply_message;
        this.NotiDate=Response.reply_message[0].createdAt;
        }

        }else{
          this.utilityservice.hideLoading();
          let alert={message:Response.message,duration:3000}
           this.messagealert(alert);
        }
      },(error)=>{
        this.utilityservice.hideLoading();


        let alert={message:error,duration:3000}
              this.messagealert(alert);
    });

    }else{

      let alert={message:'Internet connection not available.',duration:3000}
      this.messagealert(alert);
    }

  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /*****************Notification Reply***************** */

  ReplyNotification(notificationID){
    this.type='Reply';
  }
ReplyNotification2(){
          if(this.ReplyData.reply_message=='' || this.ReplyData.reply_message==undefined){
            let alert = {message:'Please enter your reply message',duration:2000};
            this.messagealert(alert);
            return false;
          }else if(!this.noti_id){
            let alert = {message:'Notification id not found.',duration:2000};
            this.messagealert(alert);
            return false;
          }else if(!this.UserId){
            let alert = {message:'No User found',duration:2000};
            this.messagealert(alert);
            return false;
          }else{


           this.utilityservice.showLoading
           this.ReplyData.user_id=this.UserId;
           this.ReplyData.notification_id=this.noti_id;
           this.ReplyData.type='user';

            console.log(this.ReplyData)
            this.serviceprovider.ReplyNotificationService(this.ReplyData, this.token).subscribe(Response => {
              this.utilityservice.hideLoading();

               if(Response.success == true){

                //  this.navCtrl.setRoot('NotificationsPage');
                this.viewCtrl.dismiss();
                //this.navCtrl.setRoot('NotificationsPage');


                }else{

                  let alert={message:Response.message,duration:2000}
                  this.messagealert(alert);
                  return false;
                }
           },(error)=>{

            this.utilityservice.hideLoading();
                let alert={message:'Server/Internet not working.',duration:2000}
                this.messagealert(alert);
                return false;
            });

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


      this.notificationSize=this.notifications.length;


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
}
