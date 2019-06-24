import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { ToastController, Platform } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';

declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-privacy-policy',
  templateUrl: 'privacy-policy.html',
})

export class PrivacyPolicyPage {
  content: any={};
  token:any;
  cms:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController, public network:Network, public networkconnService:NetworkconnService, private platform: Platform) {
  }

  ionViewDidLoad() {
    if(localStorage.getItem('user_token')){
      this.token=localStorage.getItem('user_token');
    this.getaboutcontent();
  }
    this.setOnlineStatus();
  }

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
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
  getaboutcontent(){
    this.networkconnService.checkconnection();
        if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){
        this.content.slug = 'privacy_policy';
        this.content.user_token=this.token;
        this.serviceprovider.getcontentdata(this.content).subscribe((Response)=>{
          console.log('PP', Response);
          if(Response.success == false){

            let alert={message:Response.message,duration:3000}
            this.messagealert(alert);
          }
          else if(Response.success == true){
                this.cms = Response.cms;

          }
        },
        (error)=>{
          console.log(error);
        });
  }
  else{
        let alert={message:'Internet connection is not available',duration:3000}
        this.messagealert(alert);
  }

}
}
