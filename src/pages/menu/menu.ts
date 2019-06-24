import { Component,ViewChild } from '@angular/core';
import { Nav, App,  Platform, Events, AlertController,NavController,ToastController, IonicPage} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UtilityService } from '../../providers/webservice/utility';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { FCM } from '@ionic-native/fcm';
import { TabsPage } from '../tabs/tabs';

import { WebserviceProvider } from '../../providers/webservice/webservice';
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {


  @ViewChild(Nav) nav: Nav;

  //rootPage: string;
  //rootPage:any = 'HomePage';
  user: any={};
  adminresponce:any;
   adminPh:any
  public headerIsHidden: boolean = false;

  pages: Array<{title: string, component: any }>;
  notifications:any;
  isNotification:boolean=false;
  dataRefresher:any;
  constructor(public serviceprovider: WebserviceProvider, public platform: Platform, public appCtrl: App, private alertCtrl: AlertController, private fcm: FCM, public events: Events, public statusBar: StatusBar, public splashScreen: SplashScreen,public network:Network, public networkconnService:NetworkconnService, public navCtrl:Nav,public nav_ctrl:NavController, public tostCtrl: ToastController,public utilityservice:UtilityService) {
    //this.initializeApp();
    this.isNotification=false;

    // used for an example of ngFor and navigation
    this.pages = [
      {title:'Book Appointment With a Broker', component:'BookAppooinmentPage'},
      {title:'How Much Can I Borrow?', component:'BorrowPage'},
      // {title:'Book appointment with a broker', component:'BookAppooinmentPage'},
      {title:'Loan Repayment Calculator', component:'RepaymentsPage'},

      {title:'RP Data Property Reports', component:'PropertyReportPage'},
      {title:'Common Home Loan Questions', component:'FaqPage'},

      {title:'My Details', component:'MyaccountPage'},
      {title:'My Applications', component:'MyAppliedQuestionPage'},
      {title:'Privacy Policy & Legal Stuff', component:'PrivacyPolicyPage'},
      {title:'Follow Us On Social', component:'FollowOnSocialPage'},



      //{title:'Loan Search', component:'DashboardPage',img:'loanSearch.png',class:'dashBoard'},



      //{title:'Favorites', component:'FavouritesPage',img:"favourite.png",class:"dashBoard"},
    ];

    this.adminDetail()
  }

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: 3000,
      position: 'bottom',
      cssClass: "toastcss"
    });
    toast.present();
  }

  adminDetail(){
     let user_token='';
      user_token=localStorage.getItem('user_token');
      if( user_token){
         this.serviceprovider.get_admin_detail(user_token).subscribe((Response)=>{
            console.log('responce',Response)
            this.adminresponce=Response
             if( this.adminresponce.success===true){
                this.adminPh= this.adminresponce.admindetail[0].phone;
                 console.log('ph number',this.adminPh)
                }else{
                  this.adminPh='1800 127 227'
                 }
                 },(error)=>{
                   console.log(error) }
                   ) }
      }

  openPage(page) {

  //  this.navCtrl.push(TabsPage, {componentFromNavParams: page.component});
  this.appCtrl.getActiveNavs()[0].push(page.component);
  }

  logout(){
    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
    {
    let user_token='';
      user_token=localStorage.getItem('user_token');
      if( user_token){
        this.utilityservice.showLoading();
         this.serviceprovider.logout(user_token).subscribe((Response)=>{
             if( Response.success===true){
              clearInterval(this.dataRefresher);
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
             // this.navCtrl.setRoot('HomePage');
             this.utilityservice.hideLoading();
              this.appCtrl.getRootNav().setRoot('HomePage');
                }else{
                  this.utilityservice.hideLoading();
                  let alert={message:'Unable to logout now, please try again later.',duration:3000}
                  this.messagealert(alert);
                 }
                 },(error)=>{
                  this.utilityservice.hideLoading();
                   console.log(error) })

                  }

    }else{
      let alert={message:'Internet connection is not available',duration:3000}
      this.messagealert(alert);
    }
  }


  navPush(){
    this.nav_ctrl.parent.select(0)
  }

}
