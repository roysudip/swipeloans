import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';
import { ToastController,Platform } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';



/**
 * Generated class for the FavouritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html',
})
export class FavouritesPage {
  loan:any={};
  favorite: any={};
  base_url=this.serviceprovider.getBaseURL();
  constructor(public navCtrl: NavController, public navParams: NavParams, public tostCtrl: ToastController, public serviceprovider:WebserviceProvider, private alertCtrl: AlertController, public utilityservice:UtilityService, public network:Network, public networkconnService:NetworkconnService,private platform: Platform) {
  }
  ionViewWillEnter(){
    this.showallfavloans();
    this.setOnlineStatus();
    if(localStorage.getItem('loan_amt') != ''){
      localStorage.removeItem('loan_amt');
    }

    if(localStorage.getItem('loan_type') != ''){
      localStorage.removeItem('loan_type');
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FavouritesPage');

  }

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: 3000,
      position: 'middle',
      cssClass: "toastcss"
    });
    toast.present();
  }

  public setOnlineStatus(): void {

    this.platform.ready().then(() => {
        this.checkConnection();
    });
}

// redirect to loan details page

redirecttodetailspage(loanid,bankLogo){
 console.log(loanid);
 bankLogo = bankLogo.substr(61);
 this.navCtrl.push("LoandetailsPage",{'loanid':loanid,'bankLogo':bankLogo}); //DeepLink navigation
}

RedirectBookAppoinmentPage(loanid){

  this.navCtrl.push("BookAppooinmentPage",{'loanid':loanid}); //DeepLink navigation
}

RedirectApplyLoanPage(loanid){
this.navCtrl.push("ApplyLoanPage",{'loanid':loanid}); //DeepLink navigation
}


public checkConnection(): void {

    var networkState = navigator.connection.type;

    localStorage.setItem('network_connection', networkState);

}

  //favourite list

  showallfavloans(){

    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
    {
        this.favorite.user_token = localStorage.getItem('user_token');
        this.favorite.user_id    = localStorage.getItem('_id');
        this.utilityservice.showLoading();
        this.serviceprovider.getallfavoriteloans(this.favorite).subscribe((Response)=>{
          this.utilityservice.hideLoading();
          //console.log(Response);
        if(Response.success == false){
          let alert= {message:Response.message,duration:3000}
          this.messagealert(alert);
        }
        else if(Response.success == true){


                this.favorite.fav_ist = Response.fav_ist;

            }
          },(error)=>{
            this.utilityservice.hideLoading();
              console.log(error);
          });
    }
    else{
      let alert={message:'Internet connection is not available',duration:3000}
      this.messagealert(alert);
    }

  }

  // favourite loan delete from list

  removefavourite(loanid){

    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
    {
      this.favorite.user_token = localStorage.getItem('user_token');
      this.favorite._id    = loanid;
      this.utilityservice.showLoading();

      this.serviceprovider.removefavloanfromfavlist(this.favorite).subscribe((Response)=>{
        //console.log(Response);
      if(Response.success == false){
        let alert= {message:Response.message,duration:3000}
        this.messagealert(alert);
        this.utilityservice.hideLoading();
      }
      else if(Response.success == true){
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
            console.log(Response);
            this.utilityservice.hideLoading();
          }
        },(error)=>{
            console.log(error);
            this.utilityservice.hideLoading();
        });
    }
    else{
      let alert={message:'Internet connection is not available',duration:3000}
      this.messagealert(alert);
    }

  }

   ///// REFRESH BUTTON ////
   doRefresh(refresher) {
    this.showallfavloans();
    this.setOnlineStatus();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
 }

 navPush(){
  this.navCtrl.parent.select(0)
}

savefavourite(loanid){
  //this.networkconnService.checkconnection();

  //if(localStorage.getItem("network_connection") == 'online'){
     this.loan.loan_id    = loanid;
     this.loan.user_token = localStorage.getItem('user_token');
     this.loan.user_id    = localStorage.getItem('_id');
     console.log('loanid', loanid)
     console.log(' this.loan.user_id ',  this.loan.user_id )
     //this.utilityservice.showLoading();
     this.loan.loan_fav = 'no';
      this.serviceprovider.saveasfavloan(this.loan).subscribe((Response)=>{
        console.log('Response fav', Response)
        if(Response.success == false){

          let alert={message:Response.message,duration:3000}
          this.messagealert(alert);
          this.utilityservice.hideLoading();
        }
        else if(Response.success == true){
          let loan_amount:any=0;
          if(localStorage.getItem('loan_amt')){
             loan_amount= localStorage.getItem('loan_amt')
          }else{
             loan_amount=400000;
          }

          this.showallfavloans();

              //let alert={message:Response.message,duration:3000}
              //this.messagealert(alert);
             // this.utilityservice.hideLoading();
              //this.searchloanvalue();

              //this.loan.loan_list = Response.loans;
        }
      },(error)=>{

        //this.utilityservice.hideLoading();
    });
  // }
  // else{
  //   let alert={message:'Internet connection is not available',duration:3000}
  //   this.messagealert(alert);
  // }

}
}
