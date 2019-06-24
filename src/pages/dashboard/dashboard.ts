import { async } from 'rxjs/scheduler/async';
import { Response } from '@angular/http';
import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController,Slides} from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { ToastController, Platform} from 'ionic-angular';
import { UtilityService } from '../../providers/webservice/utility';
import { FCM } from '@ionic-native/fcm';

//import * as _ from 'underscore';

import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';


/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  loan: any={};
  LoanResult:any=[];
  CustomPriceToggle=false;
  YourPrice: number=null;
  @ViewChild('slides') slides: Slides;
  saturation: number = 2500;
  LoanSearch=false;
  AllLender: any={};
  LenderLoaded=false;
  EMI:any;
  message:any;
  token:any;
  notifications:any;
  deleteNotifcation:any={};
  notificationSize:number=0;
  unreadMsg:number=0;
  count_filter=0;
  isFav:boolean=false;
  BaseUrl='';

  start:number = 1;
  limit:number = 5;
  tot_MyServiceList:number;
  tot_loaded:number;
  InfineScroll:any;
  filterData:any={};
  FilterFullSelectedIDs:any=[];
  constructor(public navCtrl: NavController,private fcm: FCM, public navParams: NavParams, private menu: MenuController, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController,public utilityservice:UtilityService, public network:Network, public networkconnService:NetworkconnService, private platform: Platform) {

  }
  ionViewWillEnter(){
    this.start = 1;
    this.limit = 5;
    this.LoanResult=[];
   // this.InfineScroll.enable(true);
    this.BaseUrl=this.serviceprovider.getBaseURL();
  if(localStorage.getItem('loan_amt')){

    let save_amount:any=localStorage.getItem('loan_amt').split(',').join('');

    //console.log(localStorage.getItem('loan_amt'));
    this.loan.min_value =this.serviceprovider.ThousandSeparator(save_amount);

  }
  else{
    this.loan.min_value = this.serviceprovider.ThousandSeparator(400000);
  }

  /************Filter data by localstorage************** */


  if(localStorage.getItem('filter')){
    this.loan=JSON.parse(localStorage.getItem('filter'));
    this.count_filter=this.loan.count
   if(localStorage.getItem('FilterFullSelectedIDs')){
    this.FilterFullSelectedIDs=JSON.parse(localStorage.getItem('FilterFullSelectedIDs'));


   }else{
    this.FilterFullSelectedIDs=[];
   }

   // this.count_filter=this.navParams.get('filter').count
    if(this.loan){
      console.log('1', this.loan)
     this.searchloanvalue(this.loan.min_value)
    }

  }else{
    console.log('2', this.loan)
    this.searchloanvalue(this.loan.min_value)
  }

    /********Filter data by nav params************** *
    if(this.navParams.get('filter')){
      this.loan=this.navParams.get('filter');
      console.log('this.loan', this.loan)
      this.count_filter=this.navParams.get('filter').count
      if(this.loan){
        this.searchloanvalue(this.loan.min_value)
      }

    }else{
      this.searchloanvalue(this.loan.min_value)
    }*/


  }
  ionViewDidLoad() {



  }

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: 3000,
      position: 'bottom',
      cssClass: "toastcss"
    });
    toast.present();
  }



public checkConnection(): void {
    var networkState = navigator.connection.type;
    localStorage.setItem('network_connection', networkState);
}


  searchloanvalue(event:any){
    return new Promise(resolve => {
    var dataResult = [];
    var amount_val:any='';

    if(!event){

      return false;
    }else{
      if(typeof event=='string' || typeof event=='number'){
         amount_val= event.toString().split(',').join('');

      }else{
         amount_val=event.target.value.split(',').join('');

         if(amount_val.length<=5){
           return false;
         }else{
          if(this.InfineScroll){
            this.InfineScroll.enable(true);
          }
          this.LoanResult=[];
          this.start=1;
          this.tot_loaded=0;
          this.tot_MyServiceList =0;
         }
      }
    }

   this.networkconnService.checkconnection();

   if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
   {
      this.loan.user_token = localStorage.getItem('user_token');
      this.loan.user_id = localStorage.getItem('_id');

      var i=0;

      // if(this.loan.loan_type_id == '' || this.loan.loan_type_id == undefined){
      //   let alert = {message:'Please select loan type',duration:3000};
      //   this.messagealert(alert);
      //   i++;
      // }

       if(this.loan.min_value == '' || this.loan.min_value == undefined){
        let alert = {message:'Please enter loan amount',duration:3000};
        this.messagealert(alert);
        i++;
      }

      if(i==0){

        localStorage.setItem('loan_amt', this.loan.min_value)
        this.utilityservice.showLoading();
         this.serviceprovider.loanserach(this.loan, this.start, this.limit).subscribe((Response)=>{

          this.loan.min_value=this.serviceprovider.ThousandSeparator(this.loan.min_value);

          if(Response.success == false){

            let alert={message:Response.message,duration:3000}
            this.messagealert(alert);

          }
          else if(Response.success == true){


            this.tot_loaded = (this.start)*this.limit;
            this.tot_MyServiceList =Response.count;


            if(Response.loans.length==0){

            }else{
              setTimeout(() => {
                for(var i=0; i< Response.loans.length; i++){

                  this.LoanResult.push(Response.loans[i]);
                 }

                this.loan.loan_list= Object.assign(this.LoanResult);


                resolve();
              }, 500);

            }

         // this.utilityservice.hideLoading();

          }
          this.utilityservice.hideLoading();

        },(error)=>{
          this.utilityservice.hideLoading();
         // this.utilityservice.hideLoading();
          this.loan.min_value=this.serviceprovider.ThousandSeparator(this.loan.min_value);
            let alert={message:'Server not connected',duration:3000}
            this.messagealert(alert);
        });

     }

    }
    else{
      let alert={message:'Internet connection is not available',duration:3000}
      this.messagealert(alert);
    }
  });
}

  EmiCalculaor(pamt,rate,month ){

     var monthlyInterestRatio = (rate/100)/12;
     var monthlyInterest = (monthlyInterestRatio*pamt);
        var top = Math.pow((1+monthlyInterestRatio),month);
           var bottom = top -1;
           var sp = top / bottom;
           var emi = ((pamt * monthlyInterestRatio) * sp);
     var result = emi.toFixed(2);
     var totalAmount = emi*month;
     var yearlyInteret = totalAmount-pamt;
     var downPayment = pamt*(20/100);
      return result;

  }
   // redirect to loan details page

   redirecttodetailspage(loanid,bankLogo,loanFav){

    bankLogo = bankLogo.substr(61);


    this.navCtrl.push("LoandetailsPage",{'loanid':loanid,'bankLogo':bankLogo,'loanFav':loanFav}); //DeepLink navigation
  }

  openfilterpage(){
    this.navCtrl.push("FilterPage"); //DeepLink navigation
  }


  savefavourite(loanid){
    //this.networkconnService.checkconnection();

    //if(localStorage.getItem("network_connection") == 'online'){
       this.loan.loan_id    = loanid;
       this.loan.user_token = localStorage.getItem('user_token');
       this.loan.user_id    = localStorage.getItem('_id');

       this.loan.loan_fav = 'no';
        this.serviceprovider.saveasfavloan(this.loan).subscribe((Response)=>{

          if(Response.success == false){

            let alert={message:Response.message,duration:3000}
            this.messagealert(alert);
            this.utilityservice.hideLoading();
          }
          else if(Response.success == true){
            if(this.InfineScroll){
            this.InfineScroll.enable(true);
          }
            this.LoanResult=[];
            this.start=1;
            this.tot_loaded=0;
            this.tot_MyServiceList =0;
           this.searchloanvalue(this.loan.min_value);

          }
        },(error)=>{

          //this.utilityservice.hideLoading();
      });
    // }
    // else{
    //   let alert={message:'Internet connection is not available',duration:3000}
    //   this.messagealert(alert);
    // }

  }

  // get user details
  getuserdetails(){
    this.loan.first_name   = localStorage.getItem('first_name');
    if(localStorage.getItem('last_name') == null){
      this.loan.last_name    = '';
    }
    else{
      this.loan.last_name    = localStorage.getItem('last_name');
    }
    this.loan.profileimage = localStorage.getItem('profileimage');
  }

  public buttonClicked: boolean = true;

  // close serach item

  closethisloan(index){

    this.loan.loan_list.splice(index,1);

  }


  // check loan favourite
  checkloanfavitem(loanid){
    this.loan.user_id    = localStorage.getItem('_id');
    this.loan.user_token = localStorage.getItem('user_token');

        this.serviceprovider.loanfavchecking(this.loan).subscribe((Response)=>{
          if(Response.success == false){

            let alert={message:Response.message,duration:3000}
            this.messagealert(alert);
            this.utilityservice.hideLoading();
          }
          else if(Response.success == true){
                //let alert={message:Response.message,duration:3000}
                //this.messagealert(alert);

                this.utilityservice.hideLoading();
                //this.loan.loan_list = Response.loans;
          }
        },(error)=>{

          this.utilityservice.hideLoading();
      });
  }

  //show max loan amount

  /*****************/



  ///// REFRESH BUTTON ////
  doRefresh(refresher) {
       setTimeout(() => {

         refresher.complete();
       }, 2000);
 }


 doInfinite(infiniteScroll) {

  this.start++;

  if (this.tot_loaded >= this.tot_MyServiceList) {
    this.InfineScroll=infiniteScroll;
   infiniteScroll.enable(false);

  }else{
    let Reqdata=this.loan.min_value;
    this.searchloanvalue(Reqdata).then((data)=>{


      infiniteScroll.complete();
    }, (error)=>{
      console.log(error)

    });
  }
}
}
