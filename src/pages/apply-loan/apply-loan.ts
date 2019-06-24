import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { UtilityService } from '../../providers/webservice/utility';
import { ToastController, Platform} from 'ionic-angular';
import { Token } from '@angular/compiler';
import { Slides } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

/**
 * Generated class for the ApplyLoanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({

  segment:'page-apply-loan/loanid/:loanid'
})
@Component({
  selector: 'page-apply-loan',
  templateUrl: 'apply-loan.html',
})
export class ApplyLoanPage {
  borrow: any={};
  indexArr = [];
  quesArr  = [];
  br: any={};
  show: boolean = true;
  optionArr = [];
  ansArr =[];
  optionsArr = [];
  ansoptArr = [];
  finalarrlist = [];
  AllQuestion=[];
  QuestoAnswer=[];
  Dob: any={};
   AnsID="";
   Elopt="";
  finalApplyquestionList=[];
  RemainingQuestion: number =0;
  QuestoAnswerId=[];
  YourDob="";
  ApplicantDob="";
  StartDate1="";
  StartDate2="";
  StartDate3="";
  StartDate4="";
  loan: any={};
lendername="";
Ansname=[];
UserPhone=null;
MaxYear:any;
 minYear:any;
  today:any;
@ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController,private alertCtrl: AlertController, public utilityservice:UtilityService,public networkconnService:NetworkconnService, public navParams: NavParams, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController) {
    var currentTime = new Date();
    this.today=new Date().toISOString();

    this.minYear=new Date(currentTime.getFullYear(), +'0'+currentTime.getMonth()+0,  currentTime.getDate()+1).toISOString();
   this.MaxYear =new Date(currentTime.getFullYear(), +'0'+currentTime.getMonth()+0,  currentTime.getDate()-1).toISOString();
  }

  ionViewDidLoad() {

    this.getallquestions();

    this.borrow.user_token=localStorage.getItem('user_token');

   this.getLenderName();
   this.UserPhone= localStorage.getItem('phone_number');


  }

  PhoneNumberAlert() {
    let alert = this.alertCtrl.create({
      title: 'We need your mobile number please',
      cssClass:'PhnAlt',
      inputs: [
        {
          name: 'phonenumber',
          placeholder: 'Eg. 9876543210',
          type:'number',
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Add',
          handler: data => {
            if (data.phonenumber) {

             if((data.phonenumber.toString().length<6) ||  (data.phonenumber.toString().length>15)){
              let alert= {message:'Phone number should be 6 to 15 character',duration:3000, position:'top'}
              this.messagealert(alert);
              return false;

              }else{
              this.utilityservice.showLoading();
              this.networkconnService.checkconnection();

              if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
               {
                this.borrow.phone_number=data.phonenumber;
                this.borrow.user_token = localStorage.getItem('user_token');

                this.serviceprovider.SaveYourPhonenumber(this.borrow).subscribe((Response)=>{

                  this.utilityservice.hideLoading();


                if(Response.success == false){

                  let alert= {message:Response.message,duration:3000}
                  this.messagealert(alert);
                }
                else if(Response.success == true){
                  localStorage.setItem('phone_number', data.phonenumber);

                  this.UserPhone= localStorage.getItem('phone_number');
                  data='';
                    }
                },(error)=>{
                  let alert= {message:'Server not working.',duration:3000}
                  this.messagealert(alert);
                });

              }
               else{
                let alert= {message:'Internet not available',duration:3000, position:'bottom'}
                this.messagealert(alert);

               }

              }

            } else {
              let alert= {message:'Please enter Phone number',duration:3000, position:'top'}
              this.messagealert(alert);
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  StopSwipe(){
    this.slides.lockSwipes(true);
  }

  getquesval(qid,ansid,optvals){
    this.borrow.quesids = qid;
    this.borrow.ansids  = ansid;
    this.borrow.ques    = optvals;
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
   }

   validatePhone(phone){
    if(phone.length<4 || phone.length>15){
      return false;
    }else{
      return true;
    }

   }
  next() {

    if(this.UserPhone == '' || this.UserPhone == undefined || this.UserPhone==null || this.UserPhone==0){
      this.PhoneNumberAlert();
     }else{
    this.slides.lockSwipes(false);

    let HomeLoanOwnerOccupied="";
    let HomeLoanInvestment="";
    let purchaseProperty="";
    let completionProperty="";
    let phone_number_user='';
    let youremail ="";
    let youraddress="";
    let yourFullname="";
    let yourAddress="";

    phone_number_user=(document.getElementById("simple_5b7fb6204eb6d625f4cd81b1") as HTMLInputElement).value
    youremail=(document.getElementById("simple_5b7fb6204eb6d625f4cd81af") as HTMLInputElement).value;
    yourFullname=(document.getElementById("simple_5b7fb6204eb6d625f4cd81b3") as HTMLInputElement).value;
    yourAddress=(document.getElementById("simple_5b7fb6204eb6d625f4cd81b0") as HTMLInputElement).value;
     HomeLoanOwnerOccupied=(document.getElementById("simple_5b7e909fa9b73b218a8594f5") as HTMLInputElement).value;

     HomeLoanInvestment=(document.getElementById("simple_5b7e909fa9b73b218a8594f4") as HTMLInputElement).value;

     purchaseProperty=(document.getElementById("simple_5b7e91d6a9b73b218a859509") as HTMLInputElement).value;

     completionProperty=(document.getElementById("simple_5b7e925ea9b73b218a85950c") as HTMLInputElement).value;

    if(HomeLoanOwnerOccupied!=""){
      (document.getElementById("simple_5b7fb5384eb6d625f4cd81a3") as HTMLInputElement).value=HomeLoanOwnerOccupied;
    }

    if(HomeLoanInvestment!=""){
     (document.getElementById("simple_5b7fb5384eb6d625f4cd81a2") as HTMLInputElement).value=HomeLoanInvestment;
    }

    if(purchaseProperty!=""){
     (document.getElementById("simple_5b7fb5b04eb6d625f4cd81ad") as HTMLInputElement).value=purchaseProperty;
    }

    if(completionProperty!=""){
     (document.getElementById("simple_5b7fb5b04eb6d625f4cd81ac") as HTMLInputElement).value=completionProperty;
    }
    if(yourFullname!="" && yourFullname!=undefined){
      (document.getElementById("simple_5b7fb6204eb6d625f4cd81b3") as HTMLInputElement).value=yourFullname;
    }else if(localStorage.getItem('first_name')!=""){

     (document.getElementById("simple_5b7fb6204eb6d625f4cd81b3") as HTMLInputElement).value=localStorage.getItem('first_name')+' '+localStorage.getItem('last_name');  //Your Name
    }
    if(phone_number_user!="" && phone_number_user!=undefined){

      (document.getElementById("simple_5b7fb6204eb6d625f4cd81b1") as HTMLInputElement).value=phone_number_user; //Phone nUmber
    }else if(this.UserPhone){
      (document.getElementById("simple_5b7fb6204eb6d625f4cd81b1") as HTMLInputElement).value=this.UserPhone; //Phone nUmber

    }



    if(youremail!="" && youremail!=undefined){
      (document.getElementById("simple_5b7fb6204eb6d625f4cd81af") as HTMLInputElement).value=youremail;
    }else if(localStorage.getItem('email')!=""){

      (document.getElementById("simple_5b7fb6204eb6d625f4cd81af") as HTMLInputElement).value=localStorage.getItem('email');  //Email
     }

      if(this.YourDob!="" && this.YourDob!=undefined){
        this.YourDob=this.YourDob;
      }else if(localStorage.getItem('dob')!=""){

      this.YourDob=localStorage.getItem('dob');  //dob
     }

     if(yourAddress!="" && yourAddress!=undefined){
      (document.getElementById("simple_5b7fb6204eb6d625f4cd81b0") as HTMLInputElement).value=yourAddress;
     }else if(localStorage.getItem('address')!=""){

      (document.getElementById("simple_5b7fb6204eb6d625f4cd81b0") as HTMLInputElement).value=localStorage.getItem('address');  //address
     }


    let questionId = this.borrow.quesids;
    let radioval = this.borrow.ques_list.length;

    let currentIndex = this.slides.getActiveIndex();

    let zeroindex = 1;
    let nextindex = currentIndex+1;
    this.indexArr.push(currentIndex);

    let currentQuestion = this.borrow.ques_list[currentIndex]._id;

    let currentanstype = this.borrow.ques_list[currentIndex].type;
    let currentAns    = this.borrow.ques_list[currentIndex].answer;




     if(currentanstype=='option'){

      let currentques   = this.borrow.ques_list[currentIndex].question;
      let currentquesid = this.borrow.ques_list[currentIndex]._id;
      let optionsArr    = this.borrow.ques_list[currentIndex].options;

        if(currentAns=="" || currentAns==undefined){
      let alert={message:'Please select your answer',duration:3000}
              this.messagealert(alert);
              let textAnswer=false;
           return false;
      }

      optionsArr.forEach(element => {
        if(element.option == currentAns){
          this.QuestoAnswer.push(currentAns);
          this.QuestoAnswerId.push(element._id);
          this.Ansname.push(element.option);

          this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(this.QuestoAnswerId),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":JSON.stringify(this.Ansname)});
          this.QuestoAnswer=[];
          this.QuestoAnswerId=[];
          this.Ansname=[];
         }

       });



       this.ansArr.push({"question":currentques,"ques_id":currentquesid,"options":this.optionArr});

       //this.quesArr.push({"ques":questionId,"ans":this.borrow.ansids});
     }else if(currentanstype=='simple'){

      let currentques   = this.borrow.ques_list[currentIndex].question;
      let currentquesid = this.borrow.ques_list[currentIndex]._id;
      let optionsArr    = this.borrow.ques_list[currentIndex].options;
      let quesarrAll=this.borrow.ques_list[currentIndex];
      let AnsID="";
      let Elopt="";
      let currentAns    = this.borrow.ques_list[currentIndex].answer;
      let textAnswer=true;



      optionsArr.forEach(element => {

        if(element._id=='5b7fb6204eb6d625f4cd81b2'){
          answerSimple=this.YourDob;
        }else if(element._id=='5b7fb6754eb6d625f4cd81b8'){

          answerSimple=this.ApplicantDob;
        }else if(element._id=='5b7fa4df10c4370e59c4122c'){

          answerSimple=this.StartDate1;
        }else if(element._id=='5b7fae90eb2ff02506be1a41'){

          answerSimple=this.StartDate2;
        }else if(element._id=='5b7fb16d4eb6d625f4cd816b'){

          answerSimple=this.StartDate3;
        }else if(element._id=='5b7fb2544eb6d625f4cd8178'){

          answerSimple=this.StartDate4;
        }else{
      var   answerSimple= ((document.getElementById("simple_"+element._id) as HTMLInputElement).value);
      }




      if(answerSimple=="" || answerSimple==undefined){
        let alert={message:'Please add your answer',duration:3000}
                this.messagealert(alert);
                textAnswer= false;
        }else if(answerSimple!='' && element.option=='E-mail' && !this.validateEmail(answerSimple)){
          let alert={message:'Please enter valid email',duration:3000}
          this.messagealert(alert);
          textAnswer= false;

        }else if(answerSimple!='' && element._id=='5b7fb6204eb6d625f4cd81b1' &&  !this.validatePhone(answerSimple)){


              textAnswer= false;

              let alert={message:'Phone number should be 6 to 15 character',duration:3000}
              this.messagealert(alert);
              return false;

        }else if(answerSimple!='' && element._id=='5b7fb6754eb6d625f4cd81b7' &&  !this.validatePhone(answerSimple)){


          textAnswer= false;

          let alert={message:'Phone number should be 6 to 15 character',duration:3000}
          this.messagealert(alert);
          return false;

    }else{

        this.QuestoAnswer.push(answerSimple);

         AnsID=element._id;
         this.QuestoAnswerId.push(AnsID);
         Elopt=element.option;
         this.Ansname.push(Elopt);

        }
      });
     if(textAnswer==true){

      //this.QuestoAnswer=JSON.stringify(this.QuestoAnswer);
      this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(this.QuestoAnswerId),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":JSON.stringify(this.Ansname)});
      this.QuestoAnswer=[];
      this.QuestoAnswerId=[];
      this.Ansname=[];
    }else{

    return false;
    }
  }else if(currentanstype=='dropdown'){

    let currentques   = this.borrow.ques_list[currentIndex].question;
    let currentquesid = this.borrow.ques_list[currentIndex]._id;
    let optionsArr    = this.borrow.ques_list[currentIndex].options;
    let quesarrAll=this.borrow.ques_list[currentIndex];
    let AnsID="";
    let Elopt="";

    let textAnswer=true;


    optionsArr.forEach(element => {

    var   answerSimple= ((document.getElementById("dropdown_"+element._id) as HTMLInputElement).value);
    if(answerSimple=="" || answerSimple==undefined){
      let alert={message:'Please select your answer',duration:3000}
              this.messagealert(alert);
              textAnswer= false;
      }else{

      this.QuestoAnswer.push(answerSimple);

       AnsID=element._id;
       this.QuestoAnswerId.push(AnsID);
       Elopt=element.option;
       this.Ansname.push(Elopt);
       textAnswer= true;
      }
    });
   if(textAnswer==true){



    this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(this.QuestoAnswerId),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":JSON.stringify(this.Ansname)});
    this.QuestoAnswer=[];
    this.QuestoAnswerId=[];
    this.Ansname=[];
  }else{

  return false;
  }


}
    this.quesArr.push({"questions":this.ansArr});

    if(nextindex == 1){

   //nextindex = 25;
    }

    if(nextindex == 2){

      if(currentAns == 'No'){
        nextindex = 4;

      }
      else{

        nextindex = currentIndex+zeroindex;

      }

    }
     else if(nextindex == 4){
      if(currentAns == 'Refinance my current loan only'){
         nextindex = 5;


      }
      else if(currentAns == 'Unlock equity for personal purposes' || currentAns =='Unlock equity for investment purposes'){
         nextindex = 7;

      }
      else{
         nextindex = currentIndex+zeroindex;

      }
    }
    else if(nextindex == 5){
      if(this.borrow.ques_list[3].answer == 'Build on a block of land I already own'){
        nextindex = 6;

       }
    } else if(nextindex == 6){

      if(this.borrow.ques_list[1].answer =='No'){
        nextindex = 7;

       }else if(this.borrow.ques_list[3].answer == 'Refinance my current loan only' || this.borrow.ques_list[3].answer == 'Buy a property with a cash deposit' || this.borrow.ques_list[3].answer == 'Buy a property using equity'){
        nextindex = 7;

       }
    }else if(nextindex == 9){

      if(this.borrow.ques_list[8].answer =='retired' || this.borrow.ques_list[8].answer =='not employed'){
        nextindex = 16;


       }
    }else if(nextindex == 11){
      if(this.borrow.ques_list[10].answer =='n/a'){
        nextindex = 16;

       }
    }else if(nextindex == 12){
      if(this.borrow.ques_list[0].answer =='Just me'){
        nextindex = 16;

       }
    }else if(nextindex == 13){

      if(this.borrow.ques_list[12].answer =='retired' || this.borrow.ques_list[12].answer =='not employed'){
        nextindex = 16;

       }
    }



    else if(nextindex == 17){
      if(this.borrow.ques_list[0].answer !='Just me'){
        nextindex = 17;

       }else{
        nextindex = 18;


       }


    }

   else if(nextindex == 18){

      if(this.borrow.ques_list[0].answer =='Just me'){
        nextindex = 18;

       }else{
        nextindex =19;


       }
    }

    else if(nextindex == 19){

      if(this.borrow.ques_list[0].answer =='Just me'){
        nextindex = 20;

       }else{
        nextindex =21;


       }
    }

    else if(nextindex == 20){
      if(this.borrow.ques_list[0].answer =='Just me'){
        nextindex = 22;

       }else{
        nextindex =21;


       }
    }

    else if(nextindex == 21){
      if(this.borrow.ques_list[0].answer =='Just me'){
        nextindex = 22;

       }else{
        nextindex =23;


       }
    }

    else if(nextindex == 22){

    if(this.borrow.ques_list[0].answer =='Just me'){
            nextindex = 22;

          }else{
            nextindex =23;


          }
    }

    else if(nextindex == 23){

    if(this.borrow.ques_list[0].answer =='Just me'){
            nextindex = 24;
          }else{
            nextindex =23;

          }
    }else if(nextindex == 26){


      //this.borrow.ques_list[7].answer=2;
      if(this.borrow.ques_list[7].answer=='No' || this.borrow.ques_list[7].answer=="" || this.borrow.ques_list[7].answer==undefined){

        if(this.borrow.ques_list[0].answer =='Just me'){
        this.show = false;

        this.RemainingQuestion=0;

        }else{
         // this.show = false;

          //this.RemainingQuestion=0;
          this.show = true;


        }
       }
    }else if(nextindex == 27){
      //this.borrow.ques_list[7].answer=2;
      if(this.borrow.ques_list[7].answer=='No' || this.borrow.ques_list[7].answer=="" || this.borrow.ques_list[7].answer==undefined){
        this.show = false;

        this.RemainingQuestion=0;
       }else{
        if(this.borrow.ques_list[0].answer =='Just me'){
          nextindex = 28;
        }else{
          nextindex = 27;
        }

       }
    }else if(nextindex == 30){

      if(this.borrow.ques_list[7].answer=='I will have one guarantor'){
      this.show = false;
      this.RemainingQuestion=0;

      }
     }else if(nextindex == this.borrow.ques_list.length-1){
      this.show = false;
      this.RemainingQuestion=0;
    }

    this.slides.slideTo(nextindex);

    this.slides.lockSwipes(true);



  }
  }




  // submit borrow form

  submitborrow(){

     this.borrow.loan_id = this.navParams.get('loanid');
      if(this.borrow.ques_list.length>0 && this.optionArr.length>0){
       // this.utilityservice.showLoading();
       //this.finalarrlist.push({'finalAnswer':this.optionArr});
      let questionId = this.borrow.quesids;


       let radioval = this.borrow.ques;

       let currentIndex = this.slides.getActiveIndex();


       let zeroindex = 1;
       let nextindex = currentIndex+1;
       this.indexArr.push(currentIndex);

       let currentQuestion = this.borrow.ques_list[currentIndex]._id;

       let currentanstype = this.borrow.ques_list[currentIndex].type;
       let currentAns    = this.borrow.ques_list[currentIndex].answer;



       if(currentanstype=='option'){

        let currentques   = this.borrow.ques_list[currentIndex].question;
        let currentquesid = this.borrow.ques_list[currentIndex]._id;
        let optionsArr    = this.borrow.ques_list[currentIndex].options;

          if(currentAns=="" || currentAns==undefined){
        let alert={message:'Please select your answer',duration:3000}
                this.messagealert(alert);
            return false;
              }

        optionsArr.forEach(element => {
          if(element.option == currentAns){
            this.QuestoAnswer.push(currentAns);
            this.QuestoAnswerId.push(element._id);

            this.Ansname.push(element.option);

           // this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(this.QuestoAnswerId),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":element.option});

        if(this.optionArr[this.optionArr.length-1]['quesId'] != currentQuestion){
              this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(this.QuestoAnswerId),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":JSON.stringify(this.Ansname)});
         }else{
          this.optionArr.pop();
          this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(this.QuestoAnswerId),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":JSON.stringify(this.Ansname)});
         }




            this.QuestoAnswer=[];
            this.QuestoAnswerId=[];
            this.Ansname=[];
           }
           //console.log(element.option);
         });

         this.ansArr.push({"question":currentques,"ques_id":currentquesid,"options":this.optionArr});


         //this.quesArr.push({"ques":questionId,"ans":this.borrow.ansids});
       }else if(currentanstype=='simple'){

        let currentques   = this.borrow.ques_list[currentIndex].question;
        let currentquesid = this.borrow.ques_list[currentIndex]._id;
        let optionsArr    = this.borrow.ques_list[currentIndex].options;
        let quesarrAll=this.borrow.ques_list[currentIndex];
        let AnsID="";
        let Elopt="";

        let textAnswer=true;


        optionsArr.forEach(element => {



          if(element._id=='5b7fb6204eb6d625f4cd81b2'){
            answerSimple=this.YourDob;
          }else if(element._id=='5b7fb6754eb6d625f4cd81b8'){

            answerSimple=this.ApplicantDob;
          }else if(element._id=='5b7fa4df10c4370e59c4122c'){

            answerSimple=this.StartDate1;
          }else if(element._id=='5b7fae90eb2ff02506be1a41'){

            answerSimple=this.StartDate2;
          }else if(element._id=='5b7fb16d4eb6d625f4cd816b'){

            answerSimple=this.StartDate3;
          }else if(element._id=='5b7fb2544eb6d625f4cd8178'){

            answerSimple=this.StartDate4;
          }else{

        var   answerSimple= ((document.getElementById("simple_"+element._id) as HTMLInputElement).value);
        }



        if(answerSimple=="" || answerSimple==undefined){
          let alert={message:'Please add your answer.',duration:3000}
                  this.messagealert(alert);
                  textAnswer= false;
          }else if(answerSimple!='' && element.option=='E-mail' && !this.validateEmail(answerSimple)){
            let alert={message:'Please enter valid email',duration:3000}
            this.messagealert(alert);
            textAnswer= false;

          }else if(answerSimple!='' && element._id=='5b7fb6204eb6d625f4cd81b1' &&  !this.validatePhone(answerSimple)){


            textAnswer= false;

            let alert={message:'Phone number should be 6 to 15 character',duration:3000}
            this.messagealert(alert);
            return false;

      }else if(answerSimple!='' && element._id=='5b7fb6754eb6d625f4cd81b7' &&  !this.validatePhone(answerSimple)){


        textAnswer= false;

        let alert={message:'Phone number should be 6 to 15 character',duration:3000}
        this.messagealert(alert);
        return false;

  }else{

          this.QuestoAnswer.push(answerSimple);

           AnsID=element._id;

           this.QuestoAnswerId.push(AnsID);
           Elopt=element.option;
           this.Ansname.push(Elopt);

          }
        });
       if(textAnswer==true){

        //this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(this.QuestoAnswerId),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":Elopt});

        if(this.optionArr[this.optionArr.length-1]['quesId'] != currentQuestion){
          this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(this.QuestoAnswerId),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":JSON.stringify(this.Ansname)});
     }else{
      this.optionArr.pop();
      this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(this.QuestoAnswerId),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":JSON.stringify(this.Ansname)});
     }



        this.QuestoAnswer=[];
        this.QuestoAnswerId=[];
        this.Ansname=[];
      }else{

        return false;
      }
    }else if(currentanstype=='dropdown'){

      let currentques   = this.borrow.ques_list[currentIndex].question;
      let currentquesid = this.borrow.ques_list[currentIndex]._id;
      let optionsArr    = this.borrow.ques_list[currentIndex].options;
      let quesarrAll=this.borrow.ques_list[currentIndex];
      let AnsID="";
      let Elopt="";

      let textAnswer=true;


      optionsArr.forEach(element => {

      var   answerSimple= ((document.getElementById("dropdown_"+element._id) as HTMLInputElement).value);
      if(answerSimple=="" || answerSimple==undefined){
        let alert={message:'Please add your answer',duration:3000}
                this.messagealert(alert);
                textAnswer= false;
        }else{

        this.QuestoAnswer.push(answerSimple);

         AnsID=element._id;
         this.QuestoAnswerId.push(AnsID);
         Elopt=element.option;
         this.Ansname.push(Elopt);
         textAnswer= true;
        }
      });
     if(textAnswer==true){

     // this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(AnsID),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":Elopt});

      if(this.optionArr[this.optionArr.length-1]['quesId'] != currentQuestion){
        this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(AnsID),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":JSON.stringify(this.Ansname)});
   }else{
    this.optionArr.pop();
    this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(AnsID),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":JSON.stringify(this.Ansname)});
   }


      this.QuestoAnswer=[];
      this.QuestoAnswerId=[];
      this.Ansname=[];
    }else{

      return textAnswer;
    }


    }



   this.finalarrlist.push({'user_token':this.borrow.user_token,'loan_id':this.borrow.loan_id, 'finalAnswer':this.optionArr});

   if(this.finalarrlist.length>0){
    this.utilityservice.showLoading();
                this.serviceprovider.SaveApplyQuestion(this.finalarrlist[this.finalarrlist.length-1]).subscribe((Response)=>{
                  this.utilityservice.hideLoading();
              if(Response.success == false){
              let alert={message:Response.message,duration:3000}
              this.messagealert(alert);
              this.utilityservice.hideLoading();
              }
              else if(Response.success == true){


                let loan_amt=localStorage.getItem('loan_amt');
                let first_name=localStorage.getItem('first_name');
             let ThankYouMsg='Thanks '+first_name+' for your home loan application for $'+loan_amt+' with '+this.lendername+'. We are processing this urgently and a home loan specialist will be in contact within 24 hours to update you on the progress of your application. ';
             // this.navCtrl.setRoot("ThankYouPage", {'ThankYouMsg':ThankYouMsg});

              this.navCtrl.push("ThankYouPage", {'ThankYouMsg':ThankYouMsg});

              this.finalarrlist=[];
            this.ansArr=[];

              }
          },(error)=>{

              this.utilityservice.hideLoading();

              let alert={message:'Something went wrong, try again later.',duration:3000}
              this.messagealert(alert);
          });


        }


     }

  }


      //this.slides.lockSwipes(true);





  slideChanged(){

    let currentIndex = this.slides.getActiveIndex();

   if(currentIndex==26){

    if(this.borrow.ques_list[7].answer=='No' || this.borrow.ques_list[7].answer=="" || this.borrow.ques_list[7].answer==undefined){

    }

   }
    if(this.slides.isBeginning()){

      this.RemainingQuestion=this.borrow.ques_list.length-1;
    }else if(currentIndex==1){

      this.RemainingQuestion=this.borrow.ques_list.length-2;

    }else if(currentIndex>1 && this.show==true){

      this.RemainingQuestion=(this.borrow.ques_list.length)-(currentIndex+2);

    }else if(this.show == false){
      this.RemainingQuestion=0;
    }else if(this.slides.isEnd()){

      this.RemainingQuestion=0;
    }
  }
  prev(){

    this.slides.lockSwipes(false);
    this.show = true;
    var indexlength = this.indexArr.length;


    let lastelem = this.indexArr[this.indexArr.length - 1];
        if(indexlength>1){
          var index = this.indexArr.indexOf(lastelem);
          if (index > -1) {
            this.indexArr.splice(index, 1);
            this.optionArr.splice(index,1);
            this.quesArr.splice(index,1);

          }
        }
    this.slides.slideTo(lastelem);
    this.slides.lockSwipes(true);



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

  getquestionval(e, optionid, optval, quesid){


  }

  getallquestions(){

    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
     {

     this.borrow.user_token = localStorage.getItem('user_token');
      this.utilityservice.showLoading();
     this.serviceprovider.getAllApplyQuestion(this.borrow).subscribe((Response)=>{

          if(Response.success == false){
           let alert= {message:Response.message,duration:3000}
           this.messagealert(alert);

          }
          else if(Response.success == true){
            console.log('question_list',Response.questions);
            return this.borrow.ques_list =  Response.questions;
          }
          this.utilityservice.hideLoading();
     },(error)=>{
      let alert={message:'Server is not working',duration:3000}
      this.messagealert(alert);
      this.utilityservice.hideLoading();
     });
    }
   else{
       let alert={message:'Internet connection is not available',duration:3000}
        this.messagealert(alert);
    }

   }

   nextQuestion(questionId){


   }


   ///// Lender name ////

   getLenderName(){

    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
     {
    this.loan.user_token = localStorage.getItem('user_token');
    this.loan.loan_id = this.navParams.get('loanid');

   // this.utilityservice.showLoading();
    this.serviceprovider.lendername(this.loan).subscribe((Response)=>{
      if(Response.success == false){

     //   this.utilityservice.hideLoading();
      }
      else if(Response.success == true){

       return  this.lendername=Response.data.lender.lender;

        }
    },(error)=>{

     //   this.utilityservice.hideLoading();
    });}
    else{
      let alert={message:'Internet connection is not available',duration:3000}
      this.messagealert(alert);
    }


   }


}
