import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CmsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cms-modal',
  templateUrl: 'cms-modal.html',
})
export class CmsModalPage {

  CmsContent="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController ) {
  }

  ionViewDidLoad() {

    this.CmsContent=this.navParams.get('CmsContent');
  }


  dismiss() {
    this.viewCtrl.dismiss();

  }
}
