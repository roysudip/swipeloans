import { Component,ViewChild } from '@angular/core';
import { Nav, App,ToastController,  Platform, Events, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { NetworkconnService } from '../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { FCM } from '@ionic-native/fcm';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any ='';
  user: any={};


  public headerIsHidden: boolean = false;

  pages: Array<{title: string, component: any, img: any, class: any}>;
  notifications:any;
  isNotification:boolean=false;


  // constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
  //   platform.ready().then(() => {
  //     // Okay, so the platform is ready and our plugins are available.
  //     // Here you can do any higher level native things you might need.
  //     statusBar.styleDefault();
  //     splashScreen.hide();
  //   });
  // }


  constructor(public platform: Platform, public appCtrl: App, public tostCtrl: ToastController, private alertCtrl: AlertController, private fcm: FCM, public events: Events, public statusBar: StatusBar, public splashScreen: SplashScreen,public network:Network, public networkconnService:NetworkconnService) {
    this.initializeApp();
    this.isNotification=false;

    // used for an example of ngFor and navigation
    // this.pages = [

    //   {title:'Profile', component:'MyaccountPage',img:"myAccount.png",class:"logout"},
    //   {title:'Dashboard', component:'BtnpagePage',img:"dashboardMenuIcon.png",class:"dashBoard"},
    //   {title:'Loan Search', component:'DashboardPage',img:'loanSearch.png',class:'dashBoard'},

    //   {title:'How much can I borrow?', component:'BorrowPage',img:'query.png',class:'dashBoard'},

    //   {title:'Repayment Calculator', component:'RepaymentsPage',img:'loanCalcuter.png',class:'dashBoard'},

    //   {title:'Property Report', component:'PropertyReportPage',img:"property.png",class:"dashBoard"},
    //   {title:'Favorites', component:'FavouritesPage',img:"favourite.png",class:"dashBoard"},
    //   {title:'FAQ', component:'FaqPage',img:"faq.png",class:"dashBoard"}
    // ];


    this.events.subscribe("loginCheck", (data) => {
      this.user.user_token=localStorage.getItem('user_token');
      this.user.promo_code=localStorage.getItem('promo_code');
      this.user.phone_number=localStorage.getItem('phone_number');
  });


  this.platform.ready().then(() => {
    if(this.platform.is('core') || this.platform.is('mobileweb')) {

    } else {

      this.initPushNotification();
      this.isNotification=true;
    }



  });

  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // this.platform.registerBackButtonAction(() => {
      //   if (this.counter == 0) {
      //     this.counter++;
      //     this.presentToast();
      //     setTimeout(() => { this.counter = 0 }, 3000)
      //   } else {
      //     // console.log("exitapp");
      //     this.platform.exitApp();
      //   }
      // }, 0)

      //this.rootPage = 'HomePage'
     if(localStorage.getItem('user_token') != null){
     this.rootPage= TabsPage;

     }
      else{
          this.rootPage = 'HomePage';
     }

      this.networkconnService.checkconnection();

    });

    // this.user.user_name = localStorage.getItem('first_name')+' '+localStorage.getItem('last_name');
    // this.user.email     = localStorage.getItem('email');
    // this.user.profileimage = localStorage.getItem('profileimage');
  }



  presentToast() {
    let toast = this.tostCtrl.create({
      message: "Press again to exit",
      duration: 3000,
      position: "middle"
    });
    toast.present();
  }


  initPushNotification() {

    this.fcm.subscribeToTopic('marketing');

    this.fcm.getToken().then(token=>{
      // this.backend.registerToken(token);

          localStorage.setItem("deviceToken", token);
        })

    this.fcm.onNotification().subscribe(data=>{

        if(data.wasTapped){
          if(localStorage.getItem('user_token') != null){
            this.appCtrl.getActiveNavs()[0].push('NotificationsPage');
          }else{
            this.appCtrl.getActiveNavs()[0].push('HomePage', {'reference':'notifications'});
          }

        }else{
          //this.appCtrl.getActiveNavs()[0].push('NotificationsPage');

        }

    })

    this.fcm.onTokenRefresh().subscribe(token=>{

      localStorage.setItem("deviceToken",  token);
    })

   //this.fcm.unsubscribeFromTopic('all');

}

  // openPage(page) {


  //   this.nav.push(page.component);
  // }

  logout(){
    //this.user.user_token = localStorage.getItem('user_token');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('email');
    localStorage.removeItem('_id');
    localStorage.removeItem('user_token');
    localStorage.removeItem('profileimage');
    localStorage.removeItem('phone_number');
    localStorage.removeItem('promo_code');
    localStorage.removeItem('address');
    localStorage.removeItem('dob');
    this.nav.push('HomePage');
  }









}
