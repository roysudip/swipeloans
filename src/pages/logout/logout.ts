import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
    if(localStorage.getItem('loan_amt') != ''){
      localStorage.removeItem('loan_amt');
    }
    
    if(localStorage.getItem('loan_type') != ''){
      localStorage.removeItem('loan_type');
    }
  }

}
