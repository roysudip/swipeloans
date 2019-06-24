import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { ToastController, Platform } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  content: any={};

  constructor(public navCtrl: NavController, public navParams: NavParams, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController, public network:Network, public networkconnService:NetworkconnService, private platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
    this.getaboutcontent();
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
            this.content.slug = 'about_us';
            this.serviceprovider.getcontentdata(this.content).subscribe((Response)=>{
              if(Response.success == false){
                console.log(Response);
                let alert={message:Response.message,duration:3000}
                this.messagealert(alert);
              }
              else if(Response.success == true){    
                    this.content.about_us = Response.cms.content;
                    console.log(Response.cms);
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
