import { Component,Pipe, PipeTransform, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController,Platform} from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { UtilityService } from '../../providers/webservice/utility';
import YouTubePlayer from 'youtube-player';
import { VideoPlayer } from '@ionic-native/video-player';
import { SocialSharing } from '@ionic-native/social-sharing/';
import domtoimage from 'dom-to-image';

declare var window:any;

// import {  } from 'ionic-angular';
// import {  } from 'ionic-angular';
/**
 * Generated class for the LoandetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var navigator: any;
declare var Connection: any;

@IonicPage({
  segment:'page-loandetails/loanid/:loanid'
})
// @Pipe({
//   name: 'sanitizeHtml'
// })
@Component({
  selector: 'page-loandetails',
  templateUrl: 'loandetails.html',
})

export class LoandetailsPage  {
  @ViewChild('container') container;
  showimageLender: boolean;
  showimageLoan: boolean;
  youtubevideoid: any;
  Loanyoutubevideoid:any;
  loan: any={};
  trustedVideoUrl: SafeResourceUrl;
  loanFeature:any = [];
  idarr:any=[];
  lender_name;
  SelectedFeatures:any=[];
  repay: any={};
  EMI: any;
  int_rate;
  show_value:boolean=false;
  new_img:any;
  BankLogo:any='';
  bank_logo:any;
  EMIDefault:any;
  loan_Fav:boolean=false;
  loan_Fav2:boolean=false;
  loan_amount:any;
  base_url=this.serviceprovider.getBaseURL();
  Base64Image:any;
  DomImage:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public serviceprovider:WebserviceProvider,public sanitizer:DomSanitizer,public network:Network, public networkconnService:NetworkconnService,public tostCtrl:ToastController, public platform: Platform, public utilityservice:UtilityService, private videoPlayer: VideoPlayer, private socialSharing: SocialSharing,  public alertCtrl: AlertController) {
      let loanid = navParams.get('loanid');

      let loanFav = navParams.get('loanFav');


  }


  ionViewDidLoad() {
     this.showimageLender=false;
    this.showimageLoan=false;
     this.getloandetails();
     this.setOnlineStatus();
     this.getallloanfeatures();
    // this.loanpaymentcalc();

    //this.viewWillEnter();
    if(localStorage.getItem('loan_amt')){
      let save_amount:any=localStorage.getItem('loan_amt').split(',').join('');

    //console.log(localStorage.getItem('loan_amt'));
    this.loan_amount =this.serviceprovider.ThousandSeparator(save_amount);


    }else{
      this.loan_amount=this.serviceprovider.ThousandSeparator(400000);
    }

    this.repay.amount=this.loan_amount;
    this.repay.year=30;

  }

  ToImage(){
      return new Promise((resolve, reject) => {
      var node = document.getElementById('ShareDiv');
      domtoimage.toPng(node).then(function (dataUrl) {
        setTimeout(() => {
          var img = new Image();
          //this.share(img.src)
      resolve(dataUrl);
        }, 500)

      }).catch(function (error) {
          reject(error);
      });
    });
  }

  ShareMe(){
  this.utilityservice.showLoading();
      this.ToImage().then(data=>{
        if(data){
          this.ShareMeImage(data)
        }

        this.utilityservice.hideLoading();
      }).catch(error=>{
        this.utilityservice.hideLoading();
        let alert={message:'Unable to generate the image right now, please try again later.',duration:3000}
        this.messagealert(alert);
    });
   //console.log('Image', this.Base64Image)
  }
  ShareMeImage(img){
return new Promise ((resolve, reject) => {
  this.socialSharing.share('Hey check out this home loan I found on the approov app', '', img, '').then((data) => {

    resolve(data);
  }).catch((err) => {
    reject(err);

  });
});
  }
  RedirectBookAppoinmentPage(loanid){
    this.navCtrl.push("BookAppooinmentPage",{'loanid':loanid}); //DeepLink navigation
  }

  RedirectApplyLoanPage(loanid){
  this.navCtrl.push("ApplyLoanPage",{'loanid':loanid}); //DeepLink navigation
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

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: 3000,
      position: 'middle',
      cssClass: 'toastcss'
    });
    toast.present();
  }

  getloandetails(){
    this.networkconnService.checkconnection();
    let loanAmt:any;
    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
     {
    this.loan.user_token = localStorage.getItem('user_token');
    this.loan.loan_id = this.navParams.get('loanid');
    //this.loan.bankLogo = this.navParams.get('bankLogo');
    //console.log('bnk', this.loan.bankLogo)

   this.utilityservice.showLoading();
    this.serviceprovider.showloandetails(this.loan).subscribe((Response)=>{

      if(Response.success == false){

       this.utilityservice.hideLoading();

       let alert={message:Response.message,duration:3000}
       this.messagealert(alert);

      } else if(Response.success == true){

          if(Response.fav==1){
            this.loan_Fav=true;
          }else{
            this.loan_Fav=false;
          }

          if(Response.loan.lender && Response.loan.lender.bank_logo){
          this.BankLogo=this.base_url+'/'+Response.loan.lender.bank_logo;

  //         this.convertImgToBase64URL(this.BankLogo, function(base64Img){

  //           this.BankLogo=base64Img;
  // }, '')

  this.convertImgToBase64URL(this.base_url+'/'+Response.loan.lender.bank_logo, "image/jpeg")
.then( base64Img => {
  this.BankLogo=base64Img;
})


          }else{
            this.BankLogo='../../assets/images/no-image-box.png';
          }


                this.loan = Response.loan;
                this.lender_name = this.loan.lender.lender;
                this.int_rate =this.loan.inerest_rate;
                if(this.loan.advertisement_fees){
                  this.loan.advertisement_fees=this.serviceprovider.ThousandSeparator(this.loan.advertisement_fees);
                }


                if(this.loan.annual_fees){
                  this.loan.annual_fees=this.serviceprovider.ThousandSeparator(this.loan.annual_fees);
                }


                if(this.loan.establishment_fees){
                  this.loan.establishment_fees=this.serviceprovider.ThousandSeparator(this.loan.establishment_fees);
                }


                if(this.loan.loan_capacity){
                  this.loan.loan_capacity=this.serviceprovider.ThousandSeparator(this.loan.loan_capacity);
                }


                if(this.loan.monthly_fees){
                  this.loan.monthly_fees=this.serviceprovider.ThousandSeparator(this.loan.monthly_fees);
                }


                if(this.loan.setup_fees){
                  this.loan.setup_fees=this.serviceprovider.ThousandSeparator(this.loan.setup_fees);
                }
                this.loan=this.loan;
                var gene=Response.loan.lender_video;

                var uid=gene.split("=")
                this.youtubevideoid=uid[1];

                var youtubeimage='https://i1.ytimg.com/vi/'+uid[1]+'/0.jpg'
                var newURl=gene.replace("watch?v=",'embed/');

                this.loan.youtube = this.sanitizer.bypassSecurityTrustResourceUrl(youtubeimage);

                var LoanVideo=Response.loan.loan_video;

                var LoanUID=LoanVideo.split("=");

                this.Loanyoutubevideoid=LoanUID[1];

                var youtubeimageLoanVideo='https://i1.ytimg.com/vi/'+LoanUID[1]+'/0.jpg'
                var newURlLoanVideo=LoanVideo.replace("watch?v=",'embed/');

                this.loan.LoanyoutubeImage = this.sanitizer.bypassSecurityTrustResourceUrl(youtubeimageLoanVideo);


                this.utilityservice.hideLoading();


                //feature section
                //this.loanFeature =[];
                if(Response.loan.loan_feature.length == undefined || Response.loan.loan_feature.length == 0){
                 this.loanFeature.push(Response.loan.loan_feature)
                }else{
                  this.loanFeature=Response.loan.loan_feature;
                }
                if(this.loan_amount){


                  loanAmt=this.loan_amount.split(',').join('');



           this.repay.calresultval= this.EmiCalculaor(loanAmt,this.loan.inerest_rate,360 );


                this.repay.calresultval=this.serviceprovider.ThousandSeparator(Math.round(this.repay.calresultval));
              }
        }
    },(error)=>{
      this.utilityservice.hideLoading();
      let alert={message:'Server is not working',duration:3000}
      this.messagealert(alert);
    });}
    else{
      let alert={message:'Internet connection is not available',duration:3000}
      this.messagealert(alert);
    }

  }

// open you tube video
  openvideoLender(url1){
    localStorage.debug = 'youtube-player:*';
    //console.log(this.showimageLender);
    this.showimageLender=true;
    //this.showimageLoan=false;
    let player;

    player =new YouTubePlayer('video-player', {

      enablejsapi:1,
      cc_load_policy:0,
      rel:0
    });

    player.loadVideoById(url1);
    //player.playVideo();

  }

  openvideoLoan(url2){
    localStorage.debug = 'youtube-player:*';
   // console.log(this.showimageLender);
    this.showimageLoan=true;
   // this.showimageLender=false;

    let player;

    player =new YouTubePlayer('video-player2', {

      enablejsapi:1,
      cc_load_policy:0,
      rel:0
    });

    player.loadVideoById(url2);
  //  player.playVideo();

  }

  // play mp4 video
  playvideo(url){
    //this.loan.mp4video = this.videoPlayer.play(url);
    //console.log(url);
    // Playing a video.
      this.videoPlayer.play(url).then(() => {

      }).catch(err => {

      });
  }

  ///// REFRESH BUTTON ////
  doRefresh(refresher) {
    this.getloandetails();
    this.setOnlineStatus();
    setTimeout(() => {

      refresher.complete();
    }, 2000);
 }

 //favourite
 savefavourite(loanid){
  //this.networkconnService.checkconnection();

  //if(localStorage.getItem("network_connection") == 'online'){
     this.loan.loan_id    = loanid;
     this.loan.user_token = localStorage.getItem('user_token');
     this.loan.user_id    = localStorage.getItem('_id');
     this.utilityservice.showLoading();
     this.loan.loan_fav = 'no';
      this.serviceprovider.saveasfavloan(this.loan).subscribe((Response)=>{
        if(Response.success == false){

          let alert={message:Response.message,duration:3000}
          this.messagealert(alert);
          this.utilityservice.hideLoading();
        }
        else if(Response.success == true){
          if(Response.fav && Response.fav=='add'){
            this.loan_Fav=true;
          }else{
            this.loan_Fav=false;
          }
             // let alert={message:Response.message,duration:3000}
              //this.messagealert(alert);
              this.utilityservice.hideLoading();
              //this.searchloanvalue();

              //this.loan.loan_list = Response.loans;
        }
      },(error)=>{

        this.utilityservice.hideLoading();
    });
  // }
  // else{
  //   let alert={message:'Internet connection is not available',duration:3000}
  //   this.messagealert(alert);
  // }

}





getallloanfeatures(){
 let selectedF='No';

   this.loan.user_token = localStorage.getItem('user_token');

   this.serviceprovider.getallloanfeaturesservice(this.loan).subscribe((Response)=>{
        if(Response.success == false){
         let alert= {message:Response.message,duration:3000}
         this.messagealert(alert);
        }
        else if(Response.success == true){


          //console.log('Response.loanfeatures', Response.loanfeatures)
          //console.log('this.loanFeature', this.loanFeature)



          for(var i=0; i<Response.loanfeatures.length; i++){

            if(this.findObjectByKey(this.loanFeature, '_id',Response.loanfeatures[i]._id )){
              selectedF='Yes'
            }else{
              selectedF='No'
            }

            this.SelectedFeatures.push({
              'fId':Response.loanfeatures[i]._id,
              'fName':Response.loanfeatures[i].feature,
              'fSelected':selectedF
            })
          }


      //  return this.loan.loanfeatures =  Response.loanfeatures;
      return  this.SelectedFeatures;
      }
   },(error)=>{
      console.log(error);
   });


 }



  findObjectByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
          return array[i];
      }
  }
  return null;
}


//loan calculatar



EmiCalculaor(pamt,rate,month, interestOnly=false ){
  //console.log('int rate1',this.int_rate)
  var monthlyInterestRatio = (rate/100)/12;
  var monthlyInterest = (monthlyInterestRatio*pamt);
     var top = Math.pow((1+monthlyInterestRatio),month);
        var bottom = top -1;
        var sp = top / bottom;
        var emi = ((pamt * monthlyInterestRatio) * sp);
  var result = Math.round (emi);
  var totalAmount = emi*month;

  var yearlyInteret = totalAmount-pamt;

  var downPayment = pamt*(20/100);
  if(interestOnly==true){
    return Math.round (monthlyInterest);
  }else{
    return result;
  }



}

loanpaymentcalc(){
  let pv=null;
  let IntYear=null;
  pv=this.repay.amount.split(',').join('');
  IntYear=this.repay.year;


// this.show_value=true;
// console.log('jjj',this.show_value)
  //let r  = this.repay.interestrate/100;
  //var pvr = pv*r;
  var i=0;

  if(pv == '' || pv == undefined){

    let alert= {message:'Please select loan amount',duration:3000, position:'bottom'}
    this.messagealert(alert);
    i++;
  }
  // else if(this.repay.interestrate == 0 || this.repay.interestrate == undefined || this.repay.interestrate == ""){
  //   let alert= {message:'Please select interest rate',duration:3000, position:'bottom'}
  //   this.messagealert(alert);
  //   i++;
  // }
  else if(IntYear == 0 || IntYear==undefined){
    let alert= {message:'Please select loan term',duration:3000}
    this.messagealert(alert);
    i++;
  }else if(IntYear>30){
    let alert= {message:'Interest year should not be more than 30',duration:3000, position:'bottom'}
    this.messagealert(alert);
    i++;
  }
  // else if(this.repay.interestrate > 15 ){

  //   let alert= {message:'Interest rate should not be more than 15.00',duration:3000, position:'bottom'}
  //   this.messagealert(alert);
  //   i++;
  // }

  if(i == 0){
    this.show_value=true;

    if(this.repay.intonly == '1'){
      this.EMI=this.EmiCalculaor(pv,this.int_rate,IntYear*12, true);
      this.repay.calresultval = this.serviceprovider.ThousandSeparator(this.EMI);

    }
    else{
      this.EMI=this.EmiCalculaor(pv,this.int_rate,IntYear*12, false);
      this.repay.calresultval = this.serviceprovider.ThousandSeparator(this.EMI);
    }

  }
  //this.repay.weekpayval.push(this.repay.calresultval);

  //alert('here');
  localStorage.removeItem('loan_amt');
}

CheckLoanYear(event){

  if(event.target.value && event.target.value>30){
  //   this.repay.IntYear='';
  //  event.target.value='';
  //   let alert= {message:'Loan term should not be more than 30',duration:2000, position:'bottom'}
  //   this.messagealert(alert);
  event.target.value=event.target.value.substr(0, event.target.value.length - 1);

  }

  if(event.target.value && event.target.value<30 && event.target.value % 1 != 0){
    //   this.repay.IntYear='';
    //  event.target.value='';
    //   let alert= {message:'Loan term should not be more than 30',duration:2000, position:'bottom'}
    //   this.messagealert(alert);
    event.target.value=event.target.value.substr(0, event.target.value.length - 1);

    }
}

convertImgToBase64URL(url, outputFormat){
  return new Promise( (resolve, reject) => {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
      var canvas:any = document.createElement('CANVAS'),
      ctx = canvas.getContext('2d'), dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      //callback(dataURL);
      canvas = null;
      resolve(dataURL);
  };
  img.src = url;

});
}
MoreInfoLoan(LoanID){
  this.networkconnService.checkconnection();
  if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
   {

    let user_token=localStorage.getItem('user_token');
 this.utilityservice.showLoading();

 this.serviceprovider.getmoreinforloanservice(user_token, LoanID).subscribe((Response)=>{
  if(Response.success == false){
   let alert= {message:Response.message,duration:3000}
   this.messagealert(alert);
  }
  else if(Response.success == true){
    let ThankYouMsg='Thanks for requesting more information, we will have a broker send you more detailed information on this loan';

     //this.navCtrl.push("ThankYouPage", {'ThankYouMsg':ThankYouMsg});
    if(Response.message){
      this.DisplayThankYouMsg(Response.message)
    }else{
      this.DisplayThankYouMsg(ThankYouMsg)
    }

  }
},(error)=>{
  let alert={message:error,duration:3000}
  this.messagealert(alert);
});
   }else{
    let alert={message:'Internet connection is not available',duration:3000}
    this.messagealert(alert);
   }
}


DisplayThankYouMsg(Msg) {
  let alert = this.alertCtrl.create({
    title: 'Thank You',
    subTitle: '',
    cssClass:'auth-alt',
    message: Msg,
    buttons: ['Ok']
  });
  alert.present();
}
}
