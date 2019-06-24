import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { ToastController, Platform } from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';


/**
 * Generated class for the RepaymentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-repayments',
  templateUrl: 'repayments.html',
})
export class RepaymentsPage {

  repay: any={};
  EMI: any;

  EmiMonthly:any;
  EmiFortnightly:any;
  EmiWeekly:any;

  constructor(public serviceprovider:WebserviceProvider, public navCtrl: NavController, public navParams: NavParams, public tostCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.repay.intonly='no';
    //this.loanpaymentcalc();
    if(localStorage.getItem('loan_amt')){
      let save_amount:any=localStorage.getItem('loan_amt').split(',').join('');
      this.repay.amount=this.serviceprovider.ThousandSeparator(save_amount);

    }else{

      this.repay.amount=this.serviceprovider.ThousandSeparator(400000);
    }

    if(localStorage.getItem('loan_type') != ''){
        localStorage.removeItem('loan_type');
    }
    this.repay.interestrate=3.99;
    this.repay.year=30

  }

  messagealert(alert){
    let toast = this.tostCtrl.create({
      message: alert.message,
      duration: alert.duration,
      position: alert.position,
      cssClass: "toastcss"
    });
    toast.present();
  }


  EmiCalculaor(pamt,rate,month, type, interestOnly=false ){
    var monthlyInterestRatio:any;
    if(type=='M'){
       monthlyInterestRatio = (rate/100)/12;

    }else if(type=='F'){
      monthlyInterestRatio = (rate/100)/26;
    }else if(type=='W'){
      monthlyInterestRatio = (rate/100)/52;
    }else{
      monthlyInterestRatio = (rate/100)/12;
    }

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
    if(this.repay.interestrate){
      this.repay.interestrate=parseFloat(this.repay.interestrate).toFixed(2);
    }

    let r  = this.repay.interestrate/100;
    var pvr = pv*r;
    var i=0;

    if(!pv){

      let alert= {message:'Please select loan amount',duration:3000, position:'bottom'}
      this.messagealert(alert);
      i++;
    }
    else if(this.repay.interestrate == 0 || this.repay.interestrate == undefined || this.repay.interestrate == ""){
      let alert= {message:'Please select interest rate',duration:3000, position:'bottom'}
      this.messagealert(alert);
      i++;
    } else if(this.repay.interestrate && !this.serviceprovider.isValidprice(this.repay.interestrate)){
      let alert= {message:'Please select valid interest rate',duration:3000, position:'bottom'}
      this.messagealert(alert);
      i++;
    }
    else if(IntYear == 0 || IntYear==undefined){
      let alert= {message:'Please select loan term',duration:3000}
      this.messagealert(alert);
      i++;
    }else if(IntYear>30){
      let alert= {message:'Interest year should not be more than 30',duration:3000, position:'bottom'}
      this.messagealert(alert);
      i++;
    }else if(this.repay.interestrate > 15 ){

      let alert= {message:'Interest rate should not be more than 15.00',duration:3000, position:'bottom'}
      this.messagealert(alert);
      i++;
    }

    if(i == 0){


      if(this.repay.intonly == 'yes'){
        this.EmiMonthly=   this.EmiCalculaor(pv,this.repay.interestrate,IntYear*12,'M', true);
        this.repay.monthlypayval = this.serviceprovider.ThousandSeparator(this.EmiMonthly);

        this.EmiFortnightly=this.EmiCalculaor(pv,this.repay.interestrate,IntYear*26, 'F',true);
        this.repay.fortnightlypayval = this.serviceprovider.ThousandSeparator(this.EmiFortnightly);

        this.EmiWeekly=this.EmiCalculaor(pv,this.repay.interestrate,IntYear*52, 'W',true);
        this.repay.weeklypayval = this.serviceprovider.ThousandSeparator(this.EmiWeekly);
      }
      else{
        this.EmiMonthly=this.EmiCalculaor(pv,this.repay.interestrate,IntYear*12,'M', false);
        this.repay.monthlypayval =this.serviceprovider.ThousandSeparator(this.EmiMonthly);


        this.EmiFortnightly=this.EmiCalculaor(pv,this.repay.interestrate,IntYear*26,'F', false);
        this.repay.fortnightlypayval =this.serviceprovider.ThousandSeparator(this.EmiFortnightly);

        this.EmiWeekly=this.EmiCalculaor(pv,this.repay.interestrate,IntYear*52, 'W',false);
        this.repay.weeklypayval = this.serviceprovider.ThousandSeparator(this.EmiWeekly);

      }

    }
    //this.repay.monthlypayval.push(this.repay.calresultval);

    //alert('here');
    //localStorage.removeItem('loan_amt');
  }


  CheckInterestRate(event){

    if(event.target.value && event.target.value>15){
      //event.target.value='';
      //this.repay.interestrate='';
      //let alert= {message:'Interest rate should not be more than 15.00',duration:2000, position:'bottom'}
      //this.messagealert(alert);
      event.target.value=event.target.value.substr(0, event.target.value.length - 1);;
    }

    if(event.target.value && event.target.value<15 && event.target.value.length>5){
      //event.target.value='';
      //this.repay.interestrate='';
      //let alert= {message:'Interest rate should not be more than 15.00',duration:2000, position:'bottom'}
      //this.messagealert(alert);
      event.target.value=event.target.value.substr(0, event.target.value.length - 1);;
    }
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
}
