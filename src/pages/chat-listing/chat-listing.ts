import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-chat-listing',
  templateUrl: 'chat-listing.html',
})
export class ChatListingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatListingPage');
  }
  MessagePage(){
    this.navCtrl.push('ChatPage')
  }

  navPush(){
    this.navCtrl.parent.select(0)
  }

}
