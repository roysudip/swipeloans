import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';
import { ToastController, Platform} from 'ionic-angular';
import { Token } from '@angular/compiler';



/**
 * Generated class for the MyBorrowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-borrow',
  templateUrl: 'my-borrow.html',
})
export class MyBorrowPage {
  user :any={};
  MyAppliedQuestionListing=[];

  constructor(public navCtrl: NavController, public utilityservice:UtilityService, public networkconnService:NetworkconnService, public navParams: NavParams, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyBorrowPage');

    this.getMyBorrowQuestion();
  }


  getMyBorrowQuestion(){
    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
     {
      this.utilityservice.showLoading();
     this.user.user_token=localStorage.getItem('user_token');

    this.serviceprovider.getmyappliedborrow(this.user).subscribe((Response)=>{
      this.utilityservice.hideLoading();
      if(Response.success == false){
        let alert={message:Response.message,duration:3000}
              this.messagealert(alert);
      }
      else if(Response.success == true){

        this.MyAppliedQuestionListing=Response.data;
        console.log(this.MyAppliedQuestionListing);
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





  ViewMyAppliedQuestion(i){

    this.navCtrl.push("ViewMyBorrowQuestionPage",{'listingId':i}); //DeepLink navigation
  }
/*****************Alert********** */

messagealert(alert){
  let toast = this.tostCtrl.create({
    message: alert.message,
    duration: 3000,
    position: 'middle',
    cssClass: "toastcss"
  });
  toast.present();
}

doRefresh(refresher) {
  this.getMyBorrowQuestion();

setTimeout(() => {

  refresher.complete();
}, 2000);
}


}
