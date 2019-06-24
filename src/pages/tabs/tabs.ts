import { DashboardPage } from './../dashboard/dashboard';
import { Component,ElementRef,ViewChild } from '@angular/core';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { ToastController, App, Platform} from 'ionic-angular';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
import { UtilityService } from '../../providers/webservice/utility';
@Component({
  selector: 'tabs-page',
  templateUrl: 'tabs.html'
})
export class TabsPage {
 // @ViewChild('one') one:ElementRef;

  tab1Root = 'DashboardPage';
  tab2Root = 'FavouritesPage';
  tab3Root = 'ChatListingPage';
  tab4Root = 'NotificationsPage';
  tab5Root = 'MenuPage';



  notification:number=0;
  message:any;
  notifications:any;
  deleteNotifcation:any={};
  notificationSize:number=0;
  unreadMsg:any='';
  FbApp:any;
  dataRefresher:any;
  FacebookID='';
  public token = localStorage.getItem('user_token');
  constructor(
    private elementRef:ElementRef,
    public tostCtrl: ToastController,
    public serviceprovider:WebserviceProvider,
    public networkconnService:NetworkconnService,
    private appAvailability: AppAvailability,
    private platform: Platform,
    private iab: InAppBrowser,
    private device: Device,
    public appCtrl: App,
    public utilityservice:UtilityService
  ) {



if (this.platform.is('ios')) {
  this.FbApp = 'fb-messenger://';
} else if (this.platform.is('android')) {
  this.FbApp = 'com.facebook.orca';
  //this.FbApp = 'https://play.google.com/store/apps/details?id=com.facebook.orca&hl=en&hl=en';
}


}

launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string, username: string) {
	let app: string;
	if (this.platform.is('ios')) {
		app = iosSchemaName;
	} else if (this.platform.is('android')) {
		app = androidPackageName;
	} else {
		let browser = this.iab.create(httpUrl + username, '_system');
		return;
	}

  this.appAvailability.check(app).then(
		() => { // success callback
			let browser = this.iab.create(appUrl + username, '_system');
		},
		() => { // error callback
			let browser = this.iab.create(httpUrl + username, '_system');
		}
	);
}


  // ngAfterViewInit() {
  //  var d1 = this.elementRef.nativeElement.querySelector('.ion-md-mic');
  //   var d2 = this.elementRef.nativeElement.querySelector('.ion-ios-mic-outline' || '.ion-ios-mic');

  //   //d2.insertAdjacentHTML('beforeend', '<span class="filterCounter2">2</span>');
  //   console.log('class',d1)

  //   if(d1){
  //     d1.insertAdjacentHTML('beforeend', '<span class="filterCounter2">2</span>');
  //   }
  //   if(d2){
  //     d2.insertAdjacentHTML('beforeend', '<span class="filterCounter2">2</span>');

  //   }
  // }


  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: alert.duration,
      position: 'bottom',
      cssClass: "toastcss",
    });
    toast.present();
  }

  refreshData(){
    if(this.token){
    this.dataRefresher =
      setInterval(() => {

        this.getMyNotifications();
        //Passing the false flag would prevent page reset to 1 and hinder user interaction
      }, 15000);

    }else{
      clearInterval(this.dataRefresher);
    }
  }

  getMyNotifications(){
    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
     {

     this.token=localStorage.getItem('user_token');

     if(this.token){
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

            if( this.unreadMsg==0){
              this.unreadMsg='';
            }

        }
    },(error)=>{

      if(this.token){
         this.serviceprovider.logout( this.token).subscribe((Response)=>{
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
              localStorage.removeItem('SelectedLoanFeatureId');
              localStorage.removeItem('SelectedLoantypes');
              localStorage.removeItem('SelectedLoanLenderId');
              localStorage.removeItem('SelectedFixedRateId')
              localStorage.removeItem('SelectedVariableRateId');
              localStorage.removeItem('SelectedLVRId');
              localStorage.removeItem('FilterFullSelectedIDs');
              localStorage.removeItem('SortBy');
              localStorage.removeItem('filter');

             this.appCtrl.getRootNav().setRoot('HomePage', {message:'Session expired, please login again.'});
                }else{
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
                  localStorage.removeItem('SelectedLoanFeatureId');
                  localStorage.removeItem('SelectedLoantypes');
                  localStorage.removeItem('SelectedLoanLenderId');
                  localStorage.removeItem('SelectedFixedRateId')
                  localStorage.removeItem('SelectedVariableRateId');
                  localStorage.removeItem('SelectedLVRId');
                  localStorage.removeItem('FilterFullSelectedIDs');
                  localStorage.removeItem('SortBy');
                  localStorage.removeItem('filter');
                   this.appCtrl.getRootNav().setRoot('HomePage', {message:'Session expired, please login again.'});
                 }
                 },(error)=>{
                  clearInterval(this.dataRefresher);
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
                  localStorage.removeItem('SelectedLoanFeatureId');
                  localStorage.removeItem('SelectedLoantypes');
                  localStorage.removeItem('SelectedLoanLenderId');
                  localStorage.removeItem('SelectedFixedRateId')
                  localStorage.removeItem('SelectedVariableRateId');
                  localStorage.removeItem('SelectedLVRId');
                  localStorage.removeItem('FilterFullSelectedIDs');
                  localStorage.removeItem('SortBy');
                  localStorage.removeItem('filter');
                  this.appCtrl.getRootNav().setRoot('HomePage', {message:'Session expired, please login again.'});

                  })

                  }

    });

  }else{
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
    localStorage.removeItem('SelectedLoanFeatureId');
    localStorage.removeItem('SelectedLoantypes');
    localStorage.removeItem('SelectedLoanLenderId');
    localStorage.removeItem('SelectedFixedRateId')
    localStorage.removeItem('SelectedVariableRateId');
    localStorage.removeItem('SelectedLVRId');
    localStorage.removeItem('FilterFullSelectedIDs');
    localStorage.removeItem('SortBy');
    localStorage.removeItem('filter');
    clearInterval(this.dataRefresher);
  }

     }else{

      let alert={message:'Internet connection not available.',duration:3000}
      this.messagealert(alert);
     }

  }

  ionViewWillEnter(){

    this.getMyNotifications();
    this.refreshData();
    this.adminDetail();

  }
  FacebookMsg(){

   // this.launchExternalApp('fb-messenger://', 'com.facebook.orca', 'instagram://user?username=', 'https://www.instagram.com/', username);
   //this.launchExternalApp('instagram://', 'com.instagram.android', 'instagram://user?username=', 'https://www.instagram.com/', 'roysudip99');

    this.appAvailability.check(this.FbApp)
  .then(
    (yes: boolean) => {
      //window.open('fb-messenger://', '_system')
     //console.log('ss', this.iab.create(this.FbApp, '_system'))
     //window.open('fb-messenger://', '_system')
     if(this.FacebookID && this.FacebookID!=''){
      window.open('http://m.me/'+this.FacebookID, '_system')
     }else{
      window.open('http://m.me/', '_system')
     }


    },
    (no: boolean) => {
      window.open('https://play.google.com/store/apps/details?id=com.facebook.orca&hl=en&hl=en', '_system')

    }
  );

  }

  adminDetail(){
    let user_token='';
     user_token=localStorage.getItem('user_token');
     if( user_token){
        this.serviceprovider.get_admin_detail(user_token).subscribe((Response)=>{
            if( Response.success===true){
               this.FacebookID=Response.admindetail[0].facebook.trim();
               }
                },(error)=>{
                  console.log(error) }
                  ) }
     }
    ///// REFRESH BUTTON ////
    doRefresh(refresher) {
      this.getMyNotifications();
      setTimeout(() => {

        refresher.complete();
      }, 2000);
   }
}
