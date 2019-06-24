//import { HttpClient } from '@angular/common/http';
import { Http, Response,RequestOptions ,Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions, Platform, ToastController, ToastOptions, AlertController } from 'ionic-angular';


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
export class UtilityService {

  constructor(
    public _loader: LoadingController,
    private platform: Platform,
    private _toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public http: Http
) { };

  private _errorHandler(error: Response) {
    return Observable.throw(error || "Server Error");
  }

  loading: any;
    loadingOptions: LoadingOptions;


    showLoading() {
      this.loadingOptions = {}

      this.loading = this._loader.create(this.loadingOptions);

      this.loading.present();

      setTimeout(() => {
          this.loading.dismissAll();
      }, 5000);


    }

    hideLoading() {
      this.loading.dismissAll();



    }

}
