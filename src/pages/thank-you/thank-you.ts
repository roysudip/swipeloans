import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,MenuController} from 'ionic-angular';

import { WebserviceProvider } from '../../providers/webservice/webservice';
import { ToastController, Platform} from 'ionic-angular';
import { UtilityService } from '../../providers/webservice/utility';
import {ModalPage} from '../modal/modal';

/**
 * Generated class for the ThankYouPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-thank-you',
  templateUrl: 'thank-you.html',
})
export class ThankYouPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private modal:ModalController) {
  }

  ionViewDidLoad() {
    let ThankYouMsg = this.navParams.get('ThankYouMsg');
    if(!ThankYouMsg){
      // this.navCtrl.setRoot("BtnpagePage");
      this.navCtrl.setRoot("DashboardPage");
    }else{
    this.openModal(ThankYouMsg);
  }
  }

  openModal(ThankYouMsg){

  const myModal = this.modal.create('ModalPage',  { message: ThankYouMsg });

  myModal.present();

  myModal.onDidDismiss((data) => {
    // this.navCtrl.setRoot("BtnpagePage");
    this.navCtrl.setRoot("DashboardPage");
  });

  myModal.onWillDismiss((data) => {
    console.log("I'm about to dismiss");
    console.log(data);
  });
  }


}
