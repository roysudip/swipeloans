import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';
import { ToastController, Platform} from 'ionic-angular';
import { Token } from '@angular/compiler';

/**
 * Generated class for the MyAppliedQuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-applied-question',
  templateUrl: 'my-applied-question.html',
})
export class MyAppliedQuestionPage {

  user :any={};
  MyAppliedQuestionListing: any={};

  loan_title="";
  constructor(public navCtrl: NavController, public utilityservice:UtilityService, public networkconnService:NetworkconnService, public navParams: NavParams, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController) {


  }

  ionViewDidLoad() {

    this.getAppliedQuestion();

  }
  isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


  getAppliedQuestion(){
    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
     {
      this.utilityservice.showLoading();
     this.user.user_token=localStorage.getItem('user_token');

    this.serviceprovider.getmyappliedloan(this.user).subscribe((Response)=>{
      this.utilityservice.hideLoading();
      if(Response.success == false){
        let alert={message:Response.message,duration:3000}
              this.messagealert(alert);
      }
      else if(Response.success == true){

        this.MyAppliedQuestionListing=Response.data;
       
        if(this.MyAppliedQuestionListing){
          this.MyAppliedQuestionListing.forEach((element, index) => {

          
          });

        }


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

    this.navCtrl.push("ViewMyAppliedQuestionPage",{'listingId':i}); //DeepLink navigation
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
    this.getAppliedQuestion();

  setTimeout(() => {

    refresher.complete();
  }, 2000);
}

}
