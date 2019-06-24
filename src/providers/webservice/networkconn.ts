//import { HttpClient } from '@angular/common/http';
import { Http, Response,RequestOptions ,Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions, Platform, ToastController, ToastOptions, AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the WebserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class NetworkconnService {

 //declare
public check : boolean = true;
public check2 : boolean = false;

  constructor(
    public _loader: LoadingController,  
    private platform: Platform,
    private _toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public http: Http,
    private network: Network
) { };

    // isOffline(){
    //   let disconnectSub = this.network.onDisconnect().subscribe(() => {
    //       this.check = false;
    //     });
    //     return this.check;
    // }

    // isOnline(){
    //      let connectSub = this.network.onConnect().subscribe(()=> {
    //          this.check2 = true;
    //      });
    //     return this.check2;
    // }

    checkconnection() {
      this.network.onConnect().subscribe(data => {
        let connectionState = data.type;
        localStorage.setItem("network_connection",  data.type);
        //return connectionState;
      }, error => console.error(error));
     
      this.network.onDisconnect().subscribe(data => {
        let connectionState = data.type;
        localStorage.setItem("network_connection",  data.type);
        //return connectionState;
      }, error => console.error(error));

    }
    

    displayNetworkUpdate(connectionState: string){
      //return connectionState;
      let networkType = this.network.type;
      this._toastCtrl.create({
        message: `You are now ${connectionState} via ${networkType}`,
        duration: 3000
      }).present();
    }
}
