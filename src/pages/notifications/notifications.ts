import { Response } from '@angular/http';
import { Component,ElementRef,ViewChild ,AfterViewInit} from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, ModalController, AlertController,ToastController, Platform } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';
import { Token } from '@angular/compiler';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage  {
  message:any;
  token:any;
  notifications:any;
  deleteNotifcation:any={};
  notificationSize:number;
  unreadMsg:any=0;
  notification:any={};
  UserId='';
  Notificationmsg='';
  NotiDate='';
  notificationID='';
  constructor(public navCtrl: NavController,
    public utilityservice:UtilityService,
    public networkconnService:NetworkconnService,
    public navParams: NavParams,
    public serviceprovider:WebserviceProvider,
    public tostCtrl: ToastController,
    public modalController: ModalController,
    private elementRef:ElementRef,
    private platform:Platform,
    public alertController: AlertController) {
      //console.log('tarasis',this.test.nativeElement)
  this.UserId=localStorage.getItem('_id');


  }

  ionViewWillEnter() {
    console.log('Enter here')
    this.getMyNotifications();

    if(this.navParams.get('notificationID')){
      this.notificationID=this.navParams.get('notificationID');
      this.ReplyNotification(this.notificationID);
    }
  }
  ionViewCanEnter(){
console.log(1111111)
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



DeleteMyNotifications(slidingItem, notification_id){

    slidingItem.close();

    this.deleteNotifcation.token=localStorage.getItem('user_token');
    this.deleteNotifcation.notification_id=notification_id

    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
    {
      this.utilityservice.showLoading();
      this.serviceprovider.deleteMyNotification(this.deleteNotifcation).subscribe((Response)=>{
        if(Response.success == false){
                this.utilityservice.hideLoading();
                let alert={message:Response.message,duration:1500}
                this.messagealert(alert);
        }
        else if(Response.success == true){
                let alert={message:'Successfully deleted your notification.',duration:1500}
                this.messagealert(alert);
                this.getMyNotifications();
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


  getMyNotifications(){
    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
     {

     this.token=localStorage.getItem('user_token');
     this.serviceprovider.getMynotification(this.token).subscribe((Response)=>{

      console.log('Response Noti', Response)

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

  ViewMyNotification(id, title, description, datetime){
    // console.log(datetime);
    // this.navCtrl.push('ViewNotificationsPage', {noti_id:id, noti_title:title, noti_description:description, datetime:datetime})
    this.updateNotificationStatus(id)

    let contactModal = this.modalController.create('ViewNotificationsPage',{noti_id:id, noti_title:title, noti_description:description, datetime:datetime,NotiReplyDate:this.NotiDate, NotiReplyMsg:this.Notificationmsg,type:"View" });
    contactModal.present();


  }

  isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
updateNotificationStatus(notification_id){
  this.networkconnService.checkconnection();
  this.notification.token=localStorage.getItem('user_token');
  this.notification.notification_id=notification_id;

  if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
  {

    this.utilityservice.showLoading();
    this.serviceprovider.updateMyNotification(this.notification).subscribe((Response)=>{

      console.log('Vew no', Response)
     if(Response.success == true){
      this.utilityservice.hideLoading();
      if(Response.reply_message && Response.reply_message[0]){
        this.Notificationmsg=Response.reply_message[0].reply_message;
      this.NotiDate=Response.reply_message[0].createdAt;
      }

      console.log('this.Notificationmsg', this.Notificationmsg)
      console.log('this.NotiDate', this.NotiDate)
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

/*****************Notification Reply***************** */

ReplyNotification(notificationID){
  //let contactModal = this.modalController.create('ViewNotificationsPage',{type:"Reply", noti_id:notificationID });
   // contactModal.present();

    this.navCtrl.push("ViewNotificationsPage", {type:"Reply", noti_id:notificationID });
}
ReplyNotification2(notificationID){

  const prompt = this.alertController.create({
    title: 'Reply',
    message: "Please enter your message",
    cssClass:'auth-alt',
    enableBackdropDismiss:false,
    inputs: [
      {
        type:'textarea',
        name: 'reply_message',
        placeholder: 'Your text here..'
      },

    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {

        }
      },
      {
        text: 'Send',
        handler: data => {
          if(data.reply_message=='' || data.reply_message==undefined){
            let alert = {message:'Please enter your Current Password',duration:2000};
            this.messagealert(alert);
            return false;
          }else if(!notificationID){
            let alert = {message:'Notification id not found.',duration:2000};
            this.messagealert(alert);
            return false;
          }else if(!this.UserId){
            let alert = {message:'No User found',duration:2000};
            this.messagealert(alert);
            return false;
          }else{


           this.utilityservice.showLoading
            data.user_id=this.UserId;
            data.notification_id=notificationID;
            data.type='user';

            console.log(data)
            this.serviceprovider.ReplyNotificationService(data, this.token).subscribe(Response => {
              this.utilityservice.hideLoading();

               if(Response.success == true){
                let alert={message:'Successfully replied',duration:2000}
                  this.messagealert(alert);
                  this.getMyNotifications();

                  return true;

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
      }
    ]
  });
  prompt.present();
}

doRefresh(refresher) {
  this.getMyNotifications();

setTimeout(() => {

  refresher.complete();
}, 2000);
}

navPush(){
  this.navCtrl.parent.select(0)
}

GoToDashboardpage(){
  this.navCtrl.push('DashboardPage')
}






}
