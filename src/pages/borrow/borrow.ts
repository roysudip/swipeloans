import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { UtilityService } from '../../providers/webservice/utility';
import { ToastController, Platform} from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the BorrowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-borrow',
  templateUrl: 'borrow.html',
})
export class BorrowPage {
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
  StartDate="";
  Ansname=[];
  UserPhone=null;
  phoneData:any={};
@ViewChild('slides') slides: Slides;
  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public networkconnService:NetworkconnService, public utilityservice:UtilityService, public navParams: NavParams, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BorrowPage');
    this.getallquestions();
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
                this.phoneData.phone_number=data.phonenumber;
                this.phoneData.user_token = localStorage.getItem('user_token');

                console.log('Phone request', JSON.stringify(this.phoneData));

                this.serviceprovider.SaveYourPhonenumber(this.phoneData).subscribe((Response)=>{
                  console.log('Phone response', JSON.stringify(Response));
                  this.utilityservice.hideLoading();


                if(Response.success == false){

                  let alert= {message:Response.message,duration:3000}
                  this.messagealert(alert);
                }
                else if(Response.success == true){
                  console.log('data_phone', data.phonenumber);
                  localStorage.setItem('phone_number', data.phonenumber);

                  this.UserPhone= localStorage.getItem('phone_number');
                  let alert= {message:'Phone number updated.',duration:3000}
                  this.messagealert(alert);
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
  next() {
    this.UserPhone= localStorage.getItem('phone_number');
    if(this.UserPhone == '' || this.UserPhone == undefined || this.UserPhone==null || this.UserPhone==0){
      this.PhoneNumberAlert();
     }else{

    this.slides.lockSwipes(false);
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

      var   answerSimple= ((document.getElementById("simple_"+element._id) as HTMLInputElement).value);

      if(answerSimple=="" || answerSimple==undefined){
        let alert={message:'Please add your answer',duration:3000}
                this.messagealert(alert);
                textAnswer= false;
                return false;
        }else{

        this.QuestoAnswer.push(answerSimple);

         AnsID=element._id;
         this.QuestoAnswerId.push(AnsID);
         Elopt=element.option;

         this.Ansname.push(element.option);

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
              return false;
      }else{

      this.QuestoAnswer.push(answerSimple);

       AnsID=element._id;
       this.QuestoAnswerId.push(AnsID);
       Elopt=element.option;
       this.Ansname.push(element.option);

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



    if(nextindex == 2){

      if(currentAns == 'No'){
        nextindex = 4; // 5 number question

      }
      else{
       // alert('question should be normal');
        nextindex = currentIndex+zeroindex;
      }

    }
     else if(nextindex == 4){
      if(currentAns == 'Refinance my current loan only'){
         nextindex = 5;
      }
      else if(currentAns == 'Unlock equity for personal purposes'){
         nextindex = 5;
      }
      else if(currentAns == 'Unlock equity for investment purposes'){
         nextindex = 5;
      }
      else{
         nextindex = currentIndex+zeroindex;
      }
    }
    else if(nextindex == 7){
      console.log('Its 7', nextindex);
      if(this.borrow.ques_list[0].answer =='Just me'){
        nextindex = 7;

       }else{
        nextindex = 8;


       }

    }

    else if(nextindex == 8){

      if(this.borrow.ques_list[0].answer =='Just me'){
        nextindex = 9;

       }else{
        nextindex =8;


       }
    }

    else if(nextindex == 9){
      console.log('Its 9', nextindex);

      if(this.borrow.ques_list[0].answer =='Just me'){
        nextindex = 9;

       }else{
        nextindex =10;


       }
    }

    else if(nextindex == 10){

      if(this.borrow.ques_list[0].answer =='Just me'){
        nextindex = 11;
        this.show = false;
        this.RemainingQuestion=0;
       }else{
        nextindex =10;


       }
    }

    else if(nextindex == 11){


      if(this.borrow.ques_list[0].answer =='Just me'){
        nextindex = 11;

       }else{
        nextindex =12;
        this.show = false;
        this.RemainingQuestion=0;
       }
    }


    if(nextindex == this.borrow.ques_list.length-1){
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
        let first_name=localStorage.getItem('first_name');
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

            //this.optionArr.push({"quesId":currentQuestion,"optid":JSON.stringify(this.QuestoAnswerId),"ans":JSON.stringify(this.QuestoAnswer),"opt_name":element.option});

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

         });

         this.ansArr.push({"question":currentques,"ques_id":currentquesid,"options":this.optionArr});

       }else if(currentanstype=='simple'){

        let currentques   = this.borrow.ques_list[currentIndex].question;
        let currentquesid = this.borrow.ques_list[currentIndex]._id;
        let optionsArr    = this.borrow.ques_list[currentIndex].options;
        let quesarrAll=this.borrow.ques_list[currentIndex];
        let AnsID="";
        let Elopt="";

        let textAnswer=true;

        optionsArr.forEach(element => {
        var   answerSimple= ((document.getElementById("simple_"+element._id) as HTMLInputElement).value);


        if(answerSimple=="" || answerSimple==undefined){
          let alert={message:'Please add your answer.',duration:3000}
                  this.messagealert(alert);
                  textAnswer= false;
                  return false;
          }else{

          this.QuestoAnswer.push(answerSimple);

           AnsID=element._id;

           this.QuestoAnswerId.push(AnsID);
           Elopt=element.option;
           this.Ansname.push(element.option);

          }
        });
       if(textAnswer==true){


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
                return false;
        }else{

        this.QuestoAnswer.push(answerSimple);

         AnsID=element._id;
         this.QuestoAnswerId.push(AnsID);
         this.Ansname.push(element.option);
         Elopt=element.option;

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
            this.serviceprovider.saveuserquestionans(this.finalarrlist[this.finalarrlist.length-1]).subscribe((Response)=>{
              this.utilityservice.hideLoading();
              if(Response.success == false){
              let alert={message:Response.message,duration:3000}
              this.messagealert(alert);

              }
              else if(Response.success == true){
                  console.log(Response);
                // let alert={message:'Your applied question has been submitted.',duration:3000}
                 //this.messagealert(alert);


             let ThankYouMsg='Thanks '+first_name+' for your borrowing capacity request. Please keep an eye on your email inbox for a summary of how much you can borrow.';


              this.navCtrl.push("ThankYouPage", {'ThankYouMsg':ThankYouMsg});

              this.finalarrlist=[];
            this.ansArr=[];

              }
          },(error)=>{
              console.log(error);
              this.utilityservice.hideLoading();
              //this.utilityservice.hideLoading();
          });


   }


     }
  }


  slideChanged(){

    let currentIndex = this.slides.getActiveIndex();


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

    console.log(indexlength);
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
         console.log(e);
         console.log(optionid);
         console.log(optval);
         console.log(quesid);

  }

  getallquestions(){

    //console.log('hererererere');
    this.networkconnService.checkconnection();

    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none')){

     this.borrow.user_token = localStorage.getItem('user_token');
    this.utilityservice.showLoading();
     this.serviceprovider.getallquestionsdata(this.borrow).subscribe((Response)=>{
          if(Response.success == false){
           let alert= {message:Response.message,duration:3000}
           this.messagealert(alert);
          }
          else if(Response.success == true){

            return this.borrow.ques_list =  Response.questions;
          }
          this.utilityservice.hideLoading();
     },(error)=>{
      let alert={message:'Server is not working',duration:3000}
      this.messagealert(alert);
        this.utilityservice.hideLoading();
     });
    } else{
     let alert={message:'Internet connection is not available',duration:3000}
       this.messagealert(alert);
   }

   }


   ///// REFRESH BUTTON ////
   doRefresh(refresher) {
    this.getallquestions();
      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
        }, 2000);
  }

}
