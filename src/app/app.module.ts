import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { TwitterConnect } from '@ionic-native/twitter-connect';

import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';
import { Facebook } from '@ionic-native/facebook';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WebserviceProvider } from '../providers/webservice/webservice';
import { UtilityService } from '../providers/webservice/utility';
import { EmbedVideo } from 'ngx-embed-video';
import { NetworkconnService } from '../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { VideoPlayer } from '@ionic-native/video-player';
import { HttpClientModule } from '@angular/common/http';

import { FCM } from '@ionic-native/fcm';
import { AppAvailability } from '@ionic-native/app-availability';
import { TabsPage } from '../pages/tabs/tabs';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';
// import { MenuPage } from '../pages/menu/menu';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
  ],
  imports: [
    FormsModule,
    MbscModule,
    BrowserModule,
    HttpClientModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WebserviceProvider,
    UtilityService,
    Network,
    NetworkconnService,
    VideoPlayer,
    TwitterConnect,
    FCM,
    AppAvailability,
    InAppBrowser,
    Device
  ]
})


export class AppModule {

}
