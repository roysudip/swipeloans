import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';
import { ToastController, Platform} from 'ionic-angular';
import { Token } from '@angular/compiler';


/**
 * Generated class for the ViewMyBorrowQuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({

  segment:'page-view-my-borrow-question/listingId/:listingId'
})
@Component({
  selector: 'page-view-my-borrow-question',
  templateUrl: 'view-my-borrow-question.html',
})
export class ViewMyBorrowQuestionPage {

  user: any={};
  answerlist=[];

  Qanswer=[];
  QanswerItem=[];
  constructor(public navCtrl: NavController, public utilityservice:UtilityService, public networkconnService:NetworkconnService, public navParams: NavParams, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log(this.navParams.get('listingId'));

    this.ViewMyBorrowQuestionAnswer();
  }


  ViewMyBorrowQuestionAnswer(){
    let ListingId="";
    //let user_token="";
       ListingId=this.navParams.get('listingId');

      this.networkconnService.checkconnection();

      if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
      {
        this.utilityservice.showLoading();
      // user_token=localStorage.getItem('user_token');
       this.user.user_token=localStorage.getItem('user_token');
      this.user.listingId=ListingId;


      this.serviceprovider.getMyBorrowQuestionAnswer(this.user).subscribe((Response)=>{
        this.utilityservice.hideLoading();
        if(Response.success == false){
          let alert={message:Response.message,duration:3000}
          this.messagealert(alert);
        }
        else if(Response.success == true){

          this.answerlist=Response.answerlist;

          console.log(Response.answerlist);
          if(this.answerlist){
            this.answerlist.forEach((element, index) => {
              if(this.answerlist[index].ans && this.isJson(this.answerlist[index].ans)){
                  this.answerlist[index].ans=JSON.parse(this.answerlist[index].ans);
              }

           if(this.answerlist[index].opt_name && this.isJson(this.answerlist[index].opt_name)){
                this.answerlist[index].opt_name=JSON.parse(this.answerlist[index].opt_name);
            }

              this.answerlist=this.answerlist;

            });

          }

          }else{

            this.utilityservice.hideLoading();

            let alert={message:'No data found, please try again later',duration:3000}
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

  isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
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
}
