import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Platform, Content, App } from 'ionic-angular';
import { NetworkconnService } from '../../providers/webservice/networkconn';
import { Network } from '@ionic-native/network';
import { UtilityService } from '../../providers/webservice/utility';
import { WebserviceProvider } from '../../providers/webservice/webservice';
import { ToastController } from 'ionic-angular';


@IonicPage({
  segment:'page-filter-item/FilterType/:FilterType'
})
@Component({
  selector: 'page-filter-item',
  templateUrl: 'filter-item.html',
})
export class FilterItemPage {
  loan:any={};
  FilterType='';
  filter:any={};
  SelectedLoanTypeId:any=[];
  LoanTypeList:any=[];
  SelectedLoanTypeSize:number=0;

  FilterFullSelectedIDs:any=[];
  SelectedLoanFeatureId:any=[];
  LoanFeatureList:any=[];
  SelectedLoanFeatureSize:number=0;

  SelectedLoanLenderId:any=[];
  LoanLenderList:any=[];
  SelectedLoanLenderSize:number=0;


  SortBy:any='';
  SelectedSortBySize:number=0;

  SelectedFixedRateId:any=[];
  LoanFixedRateList:any=[];
  SelectedFixedRateSize:number=0;

  SelectedVariableRateId:any=[];
  LoanVariableRateList:any=[];
  SelectedVariableRateSize:number=0;

  SelectedLVRId:any=[];
  LoanLVRList:any=[];
  SelectedLVRSize:number=0;

  PageTitle='';
  constructor(public navCtrl: NavController,  public app: App, public platform: Platform, public utilityservice:UtilityService,  public navParams: NavParams, public network:Network, public networkconnService:NetworkconnService, public serviceprovider:WebserviceProvider, public tostCtrl: ToastController,  public alertCtrl: AlertController) {
    this.filter.min_value = localStorage.getItem('loan_amt');
  }

  ionViewWillEnter(){
    if(localStorage.getItem('filter')){
      this.filter=JSON.parse(localStorage.getItem('filter'));
    }else{
      this.filter={};
      this.filter.min_value = localStorage.getItem('loan_amt');
    }
    if(this.navParams.get('FilterType')){
      this.FilterType=this.navParams.get('FilterType');
    }

    if(this.FilterType=='LoanType'){
      this.PageTitle='Loan Type';
    }else if(this.FilterType=='LoanFeature'){
      this.PageTitle='Loan Features';
    }else if(this.FilterType=='LoanLender'){
      this.PageTitle='Banks & Lenders';
    }else if(this.FilterType=='LoanFixedRate'){
      this.PageTitle='Fixed Rate Terms';
    }else if(this.FilterType=='LoanVariableRate'){
      this.PageTitle='Variable Rate Options';
    }else if(this.FilterType=='LoanLVR'){
      this.PageTitle='LVR';
    }else if(this.FilterType=='LoanSortBy'){
      this.PageTitle='Sort By';
    }
    // localStorage.removeItem('SelectedLoanFeatureId')
    if(localStorage.getItem('SelectedLoantypes')){
      this.SelectedLoanTypeId=JSON.parse(localStorage.getItem('SelectedLoantypes'));
    }else{
      this.SelectedLoanTypeId=[];
    }


    if(localStorage.getItem('SelectedLoanFeatureId')){
      this.SelectedLoanFeatureId=JSON.parse(localStorage.getItem('SelectedLoanFeatureId'));
    }else{
      this.SelectedLoanFeatureId=[];
    }


    if(localStorage.getItem('SelectedLoanLenderId')){
      this.SelectedLoanLenderId=JSON.parse(localStorage.getItem('SelectedLoanLenderId'));
    }else{
      this.SelectedLoanLenderId=[];
    }

    if(localStorage.getItem('SelectedFixedRateId')){
      this.SelectedFixedRateId=JSON.parse(localStorage.getItem('SelectedFixedRateId'));
    }else{
      this.SelectedFixedRateId=[];
    }

    if(localStorage.getItem('SelectedVariableRateId')){
      this.SelectedVariableRateId=JSON.parse(localStorage.getItem('SelectedVariableRateId'));
    }else{
      this.SelectedVariableRateId=[];
    }

    if(localStorage.getItem('SelectedLVRId')){
      this.SelectedLVRId=JSON.parse(localStorage.getItem('SelectedLVRId'));
    }else{
      this.SelectedLVRId=[];
    }

    if(localStorage.getItem('FilterFullSelectedIDs')){
      this.FilterFullSelectedIDs=JSON.parse(localStorage.getItem('FilterFullSelectedIDs'));
    }else{
      this.FilterFullSelectedIDs=[];
    }


    if(localStorage.getItem('SortBy')){
      this.SortBy=localStorage.getItem('SortBy');
      this.SelectedSortBySize=1;
    }else{
      this.SortBy='';
    }
    console.log('this.FilterFullSelectedIDs', (this.FilterFullSelectedIDs))
  }
  ionViewDidLoad() {
    this.networkconnService.checkconnection();
    if((localStorage.getItem("network_connection") == 'online') || (localStorage.getItem("network_connection") != 'none'))
     {
       this.getallloantype();
       this.getallloanfeatures();
      this.getallloanlenders();
     this.GetLoanFixedRateList();
     this.GetLoanVariableRateList();
      this.GetLoanLVRList();
       }else{
        let alert={message:'Internet connection is not available',duration:3000}
        this.messagealert(alert);
       }

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

  /***************Loan Type************************* */
  getallloantype(){
    let lType={};
    return new Promise(resolve => {

     this.loan.user_token = localStorage.getItem('user_token');

     this.serviceprovider.getallloantypeservice(this.loan).subscribe((Response)=>{


          if(Response.success == false){
           let alert= {message:Response.message,duration:3000}
           this.messagealert(alert);
          }
          else if(Response.success == true && Response.type_list){
            setTimeout(() => {
                for(var i=0; i< Response.type_list.length; i++){
                  if(this.SelectedLoanTypeId.indexOf(Response.type_list[i]._id)>-1){
                    lType={'_id':Response.type_list[i]._id, 'type':Response.type_list[i].type, 'checked':true};

                    if(this.FilterFullSelectedIDs.indexOf(Response.type_list[i]._id)>-1){
                  //  this.FilterFullSelectedIDs.push({'id':Response.type_list[i]._id, 'value':Response.type_list[i].type})
                    }

                      this.SelectedLoanTypeSize +=1;
                  }else{

                    lType={'_id':Response.type_list[i]._id, 'type':Response.type_list[i].type, 'checked':false};
                  }

                    this.LoanTypeList.push(lType)

                }
            }, 500);

            return this.LoanTypeList;

          }
     },(error)=>{
        console.log(error);
     });
    })
   }

   GetLoanTypeVal(event, data){

    var index = this.SelectedLoanTypeId.indexOf(data._id);

   // var indexFull = this.FilterFullSelectedIDs.indexOf(data._id);

    var indexFull:any= this.objectExists(this.FilterFullSelectedIDs, 'id', data._id)
    console.log('indexFull', event.checked)

      if(event.checked==true){

        if (index == -1) {
         this.SelectedLoanTypeId.push(data._id);
            if (indexFull == false) {
              this.FilterFullSelectedIDs.push({'id':data._id, 'value':data.type, 'type':'LoanType'})
            }
        }
      }else{


        if (index > -1) {
          this.SelectedLoanTypeId.splice(index, 1);

             this.FilterFullSelectedIDs=this.delete_by_id(this.FilterFullSelectedIDs, 'id', data._id);

        }
      }

      if(this.SelectedLoanTypeId && this.SelectedLoanTypeId.length>0){
        localStorage.setItem('SelectedLoantypes', JSON.stringify(this.SelectedLoanTypeId))

        this.SelectedLoanTypeSize=this.SelectedLoanTypeId.length;
      }else{
        this.SelectedLoanTypeSize=0;
        localStorage.setItem('SelectedLoantypes', '')
      }
      if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
        localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));

      }else{
        localStorage.setItem('FilterFullSelectedIDs', '');
      }
      this.filter.loan_type = this.SelectedLoanTypeId;
      this.filter.count=this.FilterFullSelectedIDs.length;
      localStorage.setItem('filter',  JSON.stringify(this.filter));
   }

   GetLoanTypeResult(){

    // if(this.SelectedLoanTypeId && this.SelectedLoanTypeId.length>0){
    //   localStorage.setItem('SelectedLoantypes', JSON.stringify(this.SelectedLoanTypeId))

    //   this.SelectedLoanTypeSize=this.SelectedLoanTypeId.length;
    // }else{
    //   this.SelectedLoanTypeSize=0;
    //   localStorage.setItem('SelectedLoantypes', '')
    // }
    // if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
    //   localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));

    // }else{
    //   localStorage.setItem('FilterFullSelectedIDs', '');
    // }
    //this.filter={};





    this.navCtrl.push('DashboardPage',{'filter' : this.filter})
  }

  /*******************************Loan Features************************* */
  getallloanfeatures(){

    let LoanFeature={};
    return new Promise(resolve => {

     this.loan.user_token = localStorage.getItem('user_token');

     this.serviceprovider.getallloanfeaturesservice(this.loan).subscribe((Response)=>{
          if(Response.success == false){
           let alert= {message:Response.message,duration:3000}
           this.messagealert(alert);
          }
          else if(Response.success == true){

            //return this.loan.loanfeatures =  Response.loanfeatures;

            setTimeout(() => {
              for(var i=0; i< Response.loanfeatures.length; i++){
                if(this.SelectedLoanFeatureId.indexOf(Response.loanfeatures[i]._id)>-1){
                  LoanFeature={'_id':Response.loanfeatures[i]._id, 'feature':Response.loanfeatures[i].feature, 'checked':true};
                    this.SelectedLoanFeatureSize +=1;
                }else{

                 LoanFeature={'_id':Response.loanfeatures[i]._id, 'feature':Response.loanfeatures[i].feature, 'checked':false};
                }

                  this.LoanFeatureList.push(LoanFeature)

              }
          }, 500);

          return this.LoanFeatureList;
          }
     },(error)=>{
        console.log(error);
     });


    });
   }


   GetLoanFeatureVal(event, data){

    var index = this.SelectedLoanFeatureId.indexOf(data._id);

    var indexFull:any= this.objectExists(this.FilterFullSelectedIDs, 'id', data._id)
      if(event.checked==true){

        if (index == -1) {
           this.SelectedLoanFeatureId.push(data._id);

           if(indexFull==false){
            this.FilterFullSelectedIDs.push({'id':data._id, 'value':data.feature, 'type':'LoanFeature'})
           }

        }
      }else{

        if (index > -1) {
          this.SelectedLoanFeatureId.splice(index, 1);


          this.FilterFullSelectedIDs=this.delete_by_id(this.FilterFullSelectedIDs, 'id', data._id);

        }
      }

       if(this.SelectedLoanFeatureId && this.SelectedLoanFeatureId.length>0){
      localStorage.setItem('SelectedLoanFeatureId', JSON.stringify(this.SelectedLoanFeatureId))

      this.SelectedLoanFeatureSize=this.SelectedLoanFeatureId.length;
    }else{
      this.SelectedLoanFeatureSize=0;
      localStorage.setItem('SelectedLoanFeatureId', '')
    }
    if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
      localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
    }else{
      localStorage.setItem('FilterFullSelectedIDs', '');
    }

    this.filter.loan_feature = this.SelectedLoanFeatureId;
    this.filter.count=this.FilterFullSelectedIDs.length;
    localStorage.setItem('filter',  JSON.stringify(this.filter));


   }
   GetLoanFetureResult(){

    // if(this.SelectedLoanFeatureId && this.SelectedLoanFeatureId.length>0){
    //   localStorage.setItem('SelectedLoanFeatureId', JSON.stringify(this.SelectedLoanFeatureId))

    //   this.SelectedLoanFeatureSize=this.SelectedLoanFeatureId.length;
    // }else{
    //   this.SelectedLoanFeatureSize=0;
    //   localStorage.setItem('SelectedLoanFeatureId', '')
    // }
    // if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
    //   localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
    // }else{
    //   localStorage.setItem('FilterFullSelectedIDs', '');
    // }
    // this.navCtrl.setRoot('FilterPage')


    //this.filter={};


    this.navCtrl.push('DashboardPage',{'filter' : this.filter})
   }

   /*******************************Loan Lender (banks)************************* */
    getallloanlenders(){

      let LoanLender={};
      return new Promise(resolve => {

       this.loan.user_token = localStorage.getItem('user_token');

       this.serviceprovider.getallloanlenderservice(this.loan).subscribe((Response)=>{
            if(Response.success == false){
             let alert= {message:Response.message,duration:3000}
             this.messagealert(alert);
            }
            else if(Response.success == true){

              //return this.loan.loanlenders =  Response.loanlenders;

               //return this.loan.loanfeatures =  Response.loanfeatures;

            setTimeout(() => {
              for(var i=0; i< Response.loanlenders.length; i++){
                if(this.SelectedLoanLenderId.indexOf(Response.loanlenders[i]._id)>-1){
                  LoanLender={'_id':Response.loanlenders[i]._id, 'lender':Response.loanlenders[i].lender, 'checked':true};
                    this.SelectedLoanLenderSize +=1;
                }else{

                  LoanLender={'_id':Response.loanlenders[i]._id, 'lender':Response.loanlenders[i].lender, 'checked':false};
                }

                  this.LoanLenderList.push(LoanLender)

              }
          }, 500);

          return this.LoanLenderList;
            }
       },(error)=>{
          console.log(error);
       });
      });
     }

     GetLoanlenderVal(event, data){
      var index = this.SelectedLoanLenderId.indexOf(data._id);
      var indexFull:any= this.objectExists(this.FilterFullSelectedIDs, 'id', data._id);
        if(event.checked==true){

          if (index == -1) {
             this.SelectedLoanLenderId.push(data._id);

             if(indexFull==false){
               this.FilterFullSelectedIDs.push({'id':data._id, 'value':data.lender, 'type':'LoanLender'})
             }
          }
        }else{

          if (index > -1) {
            this.SelectedLoanLenderId.splice(index, 1);
            this.FilterFullSelectedIDs=this.delete_by_id(this.FilterFullSelectedIDs, 'id', data._id);
          }
        }

        if(this.SelectedLoanLenderId && this.SelectedLoanLenderId.length>0){
          localStorage.setItem('SelectedLoanLenderId', JSON.stringify(this.SelectedLoanLenderId))

          this.SelectedLoanLenderSize=this.SelectedLoanLenderId.length;
        }else{
          this.SelectedLoanLenderSize=0;
          localStorage.setItem('SelectedLoanLenderId', '')
        }

        if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
          localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
        }else{
          localStorage.setItem('FilterFullSelectedIDs', '');
        }

        this.filter.lender = this.SelectedLoanLenderId;
    this.filter.count=this.FilterFullSelectedIDs.length;
    localStorage.setItem('filter',  JSON.stringify(this.filter));
     }


     GetLoanLenderResult(){

      // if(this.SelectedLoanLenderId && this.SelectedLoanLenderId.length>0){
      //   localStorage.setItem('SelectedLoanLenderId', JSON.stringify(this.SelectedLoanLenderId))

      //   this.SelectedLoanLenderSize=this.SelectedLoanLenderId.length;
      // }else{
      //   this.SelectedLoanLenderSize=0;
      //   localStorage.setItem('SelectedLoanLenderId', '')
      // }

      // if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
      //   localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
      // }else{
      //   localStorage.setItem('FilterFullSelectedIDs', '');
      // }
      // this.navCtrl.setRoot('FilterPage')
      this.navCtrl.push('DashboardPage',{'filter' : this.filter})
     }

  /*******************************Fixed Rate Terms************************* */
  GetLoanFixedRateList(){

    let LoanFixedRate={};
    return new Promise(resolve => {

     this.loan.user_token = localStorage.getItem('user_token');

     this.serviceprovider.getallloanfixedrateservice(this.loan).subscribe((Response)=>{
          if(Response.success == false){
           let alert= {message:Response.message,duration:3000}
           this.messagealert(alert);
          }
          else if(Response.success == true){

          setTimeout(() => {
            for(var i=0; i< Response.loanratesofterm.length; i++){

              if(Response.loanratesofterm[i].termsofyr>1){
                Response.loanratesofterm[i].termsofyr=Response.loanratesofterm[i].termsofyr+' Years';
              }else{
                Response.loanratesofterm[i].termsofyr=Response.loanratesofterm[i].termsofyr+' Year';
              }
              if(this.SelectedFixedRateId.indexOf(Response.loanratesofterm[i]._id)>-1){


                LoanFixedRate={'_id':Response.loanratesofterm[i]._id, 'termsofyr':Response.loanratesofterm[i].termsofyr, 'checked':true};
                  this.SelectedFixedRateSize +=1;
              }else{

                LoanFixedRate={'_id':Response.loanratesofterm[i]._id, 'termsofyr':Response.loanratesofterm[i].termsofyr, 'checked':false};
              }

                this.LoanFixedRateList.push(LoanFixedRate)

            }
        }, 500);

        return this.LoanFixedRateList;
          }
     },(error)=>{
        console.log(error);
     });
    });
   }

   GetLoanFixedRateVal(event, data){
    var index = this.SelectedFixedRateId.indexOf(data._id);

    var indexFull:any= this.objectExists(this.FilterFullSelectedIDs, 'id', data._id);

      if(event.checked==true){

        if (index == -1) {
           this.SelectedFixedRateId.push(data._id);
           if(indexFull==false){
            this.FilterFullSelectedIDs.push({'id':data._id, 'value':data.termsofyr, 'type':'LoanFixedRate'})
           }
        }
      }else{

        if (index > -1) {
          this.SelectedFixedRateId.splice(index, 1);
          this.FilterFullSelectedIDs=this.delete_by_id(this.FilterFullSelectedIDs, 'id', data._id);
        }
      }
       if(this.SelectedFixedRateId && this.SelectedFixedRateId.length>0){
      localStorage.setItem('SelectedFixedRateId', JSON.stringify(this.SelectedFixedRateId))

      this.SelectedFixedRateSize=this.SelectedFixedRateId.length;
    }else{
      this.SelectedFixedRateSize=0;
      localStorage.setItem('SelectedFixedRateId', '')
    }

    if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
      localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
    }else{
      localStorage.setItem('FilterFullSelectedIDs', '');
    }

      this.filter.fixedrate = this.SelectedFixedRateId;
      this.filter.count=this.FilterFullSelectedIDs.length;
      localStorage.setItem('filter',  JSON.stringify(this.filter));
   }


   GetLoanFixedRateResult(){

    // if(this.SelectedFixedRateId && this.SelectedFixedRateId.length>0){
    //   localStorage.setItem('SelectedFixedRateId', JSON.stringify(this.SelectedFixedRateId))

    //   this.SelectedFixedRateSize=this.SelectedFixedRateId.length;
    // }else{
    //   this.SelectedFixedRateSize=0;
    //   localStorage.setItem('SelectedFixedRateId', '')
    // }

    // if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
    //   localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
    // }else{
    //   localStorage.setItem('FilterFullSelectedIDs', '');
    // }

    // this.navCtrl.setRoot('FilterPage')

    this.navCtrl.push('DashboardPage',{'filter' : this.filter})

   }

    /*******************************Variable Rate Terms************************* */
  GetLoanVariableRateList(){

    let LoanVariableRate={};
    return new Promise(resolve => {

     this.loan.user_token = localStorage.getItem('user_token');

     this.serviceprovider.getallloanvariablerateservice(this.loan).subscribe((Response)=>{
          if(Response.success == false){
           let alert= {message:Response.message,duration:3000}
           this.messagealert(alert);
          }
          else if(Response.success == true){

          setTimeout(() => {
            for(var i=0; i< Response.loanVariableRate.length; i++){


              if(this.SelectedVariableRateId.indexOf(Response.loanVariableRate[i]._id)>-1){


                LoanVariableRate={'_id':Response.loanVariableRate[i]._id, 'variablerate':Response.loanVariableRate[i].variablerate, 'checked':true};
                  this.SelectedVariableRateSize +=1;
              }else{

                LoanVariableRate={'_id':Response.loanVariableRate[i]._id, 'variablerate':Response.loanVariableRate[i].variablerate, 'checked':false};
              }

                this.LoanVariableRateList.push(LoanVariableRate)

            }
        }, 500);

        return this.LoanVariableRateList;
          }
     },(error)=>{
        console.log(error);
     });
    });
   }

   GetLoanVariableRateVal(event, data){
    var index = this.SelectedVariableRateId.indexOf(data._id);
    var indexFull:any= this.objectExists(this.FilterFullSelectedIDs, 'id', data._id);
      if(event.checked==true){

        if (index == -1) {
           this.SelectedVariableRateId.push(data._id);

           if(indexFull==false){
            this.FilterFullSelectedIDs.push({'id':data._id, 'value':data.variablerate, 'type':'VariableRate'})
           }
        }
      }else{

        if (index > -1) {
          this.SelectedVariableRateId.splice(index, 1);
          this.FilterFullSelectedIDs=this.delete_by_id(this.FilterFullSelectedIDs, 'id', data._id);
        }
      }

      if(this.SelectedVariableRateId && this.SelectedVariableRateId.length>0){
        localStorage.setItem('SelectedVariableRateId', JSON.stringify(this.SelectedVariableRateId))

        this.SelectedVariableRateSize=this.SelectedVariableRateId.length;
      }else{
        this.SelectedVariableRateSize=0;
        localStorage.setItem('SelectedVariableRateId', '')
      }

      if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
        localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
      }else{
        localStorage.setItem('FilterFullSelectedIDs', '');
      }

      this.filter.variablerate = this.SelectedVariableRateId;
      this.filter.count=this.FilterFullSelectedIDs.length;
      localStorage.setItem('filter',  JSON.stringify(this.filter));
   }


   GetLoanVariableRateResult(){

    // if(this.SelectedVariableRateId && this.SelectedVariableRateId.length>0){
    //   localStorage.setItem('SelectedVariableRateId', JSON.stringify(this.SelectedVariableRateId))

    //   this.SelectedVariableRateSize=this.SelectedVariableRateId.length;
    // }else{
    //   this.SelectedVariableRateSize=0;
    //   localStorage.setItem('SelectedVariableRateId', '')
    // }

    // if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
    //   localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
    // }else{
    //   localStorage.setItem('FilterFullSelectedIDs', '');
    // }
    // this.navCtrl.setRoot('FilterPage')

    this.navCtrl.push('DashboardPage',{'filter' : this.filter})
   }

   /*******************************LVR************************* */
  GetLoanLVRList(){

    let LoanLVRRate={};
    return new Promise(resolve => {

     this.loan.user_token = localStorage.getItem('user_token');

     this.serviceprovider.getallloanratioservice(this.loan).subscribe((Response)=>{
          if(Response.success == false){
           let alert= {message:Response.message,duration:3000}
           this.messagealert(alert);
          }
          else if(Response.success == true){

          setTimeout(() => {
            for(var i=0; i< Response.lvrs.length; i++){


              if(this.SelectedLVRId.indexOf(Response.lvrs[i]._id)>-1){


                LoanLVRRate={'_id':Response.lvrs[i]._id, 'ratio':Response.lvrs[i].ratio, 'checked':true};
                  this.SelectedLVRSize +=1;
              }else{

                LoanLVRRate={'_id':Response.lvrs[i]._id, 'ratio':Response.lvrs[i].ratio, 'checked':false};
              }

                this.LoanLVRList.push(LoanLVRRate)

            }
        }, 500);

        return this.LoanLVRList;
          }
     },(error)=>{
        console.log(error);
     });
    });
   }

   GetLoanLVRVal(event, data){
    var index = this.SelectedLVRId.indexOf(data._id);

    var indexFull:any= this.objectExists(this.FilterFullSelectedIDs, 'id', data._id)


      if(event.checked==true){

        if (index == -1) {
           this.SelectedLVRId.push(data._id);
           if(indexFull==false){
           this.FilterFullSelectedIDs.push({'id':data._id, 'value':data.ratio, 'type':'LoanLVR'})
           }
        }
      }else{

        if (index > -1) {
          this.SelectedLVRId.splice(index, 1);
          this.FilterFullSelectedIDs=this.delete_by_id(this.FilterFullSelectedIDs, 'id', data._id);
        }
      }
      if(this.SelectedLVRId && this.SelectedLVRId.length>0){
        localStorage.setItem('SelectedLVRId', JSON.stringify(this.SelectedLVRId))

        this.SelectedLVRSize=this.SelectedLVRId.length;
      }else{
        this.SelectedLVRSize=0;
        localStorage.setItem('SelectedLVRId', '')
      }

      if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
        localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
      }else{
        localStorage.setItem('FilterFullSelectedIDs', '');
      }

      this.filter.lvr = this.SelectedLVRId;
    this.filter.count=this.FilterFullSelectedIDs.length;
    localStorage.setItem('filter',  JSON.stringify(this.filter));
   }


   GetLoanLVRResult(){

    // if(this.SelectedLVRId && this.SelectedLVRId.length>0){
    //   localStorage.setItem('SelectedLVRId', JSON.stringify(this.SelectedLVRId))

    //   this.SelectedLVRSize=this.SelectedLVRId.length;
    // }else{
    //   this.SelectedLVRSize=0;
    //   localStorage.setItem('SelectedLVRId', '')
    // }

    // if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
    //   localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
    // }else{
    //   localStorage.setItem('FilterFullSelectedIDs', '');
    // }
    // this.navCtrl.setRoot('FilterPage')

    this.navCtrl.push('DashboardPage',{'filter' : this.filter})
   }
  /*******************************Sort By Result************************* */
     GetSortByResult(){
     if(this.SortBy){
       this.SelectedSortBySize=1;
       localStorage.setItem('SortBy', this.SortBy);
     }else{
      localStorage.setItem('SortBy', '');
       this.SelectedSortBySize=0;
     }

     this.filter.sort_by = this.SortBy;
     localStorage.setItem('filter',  JSON.stringify(this.filter));
     this.navCtrl.push('DashboardPage',{'filter' : this.filter})
     //this.navCtrl.setRoot('FilterPage')
     }

/***************Clear item******************** */
ClearType(){
  if(this.LoanTypeList && this.LoanTypeList.length>0){
    for(let i=0; i<this.LoanTypeList.length; i++){
      this.LoanTypeList[i].checked=false;
    }
  }
  localStorage.removeItem('SelectedLoantypes');
  this.SelectedLoanTypeId=[];
  this.SelectedLoanTypeSize=0;
 // this.FilterFullSelectedIDs=this.delete_by_id_multiple(this.FilterFullSelectedIDs, 'type', 'LoanType');

 if( this.FilterFullSelectedIDs &&  this.FilterFullSelectedIDs.length>0){
   for(let i=0; i<this.FilterFullSelectedIDs.length; i++){
      if(this.FilterFullSelectedIDs[i].type=='LoanType'){

        this.FilterFullSelectedIDs.splice(i,1);
        --i;
      }


   }

   localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs))

 }
/*********update******************* */
 if(this.SelectedLoanTypeId && this.SelectedLoanTypeId.length>0){
  localStorage.setItem('SelectedLoantypes', JSON.stringify(this.SelectedLoanTypeId))

  this.SelectedLoanTypeSize=this.SelectedLoanTypeId.length;
}else{
  this.SelectedLoanTypeSize=0;
  localStorage.setItem('SelectedLoantypes', '')
}
if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
  localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));

}else{
  localStorage.setItem('FilterFullSelectedIDs', '');
}
this.filter.loan_type = this.SelectedLoanTypeId;
this.filter.count=this.FilterFullSelectedIDs.length;
localStorage.setItem('filter',  JSON.stringify(this.filter));

}

ClearFeature(){
  if(this.LoanFeatureList && this.LoanFeatureList.length>0){
    for(let i=0; i<this.LoanFeatureList.length; i++){
      this.LoanFeatureList[i].checked=false;
    }
  }
  localStorage.removeItem('SelectedLoanFeatureId');
  this.SelectedLoanFeatureId=[];
  this.SelectedLoanFeatureSize=0;
  //this.FilterFullSelectedIDs=this.delete_by_id_multiple(this.FilterFullSelectedIDs, 'type', 'LoanFeature');

  if( this.FilterFullSelectedIDs &&  this.FilterFullSelectedIDs.length>0){


    for(let i=0; i<this.FilterFullSelectedIDs.length; i++){
       if(this.FilterFullSelectedIDs[i].type=='LoanFeature'){

        this.FilterFullSelectedIDs.splice(i,1);
        --i;
       }

    }
    localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs))
    console.log(this.FilterFullSelectedIDs)
  }

/**************Update***************** */
if(this.SelectedLoanFeatureId && this.SelectedLoanFeatureId.length>0){
  localStorage.setItem('SelectedLoanFeatureId', JSON.stringify(this.SelectedLoanFeatureId))

  this.SelectedLoanFeatureSize=this.SelectedLoanFeatureId.length;
}else{
  this.SelectedLoanFeatureSize=0;
  localStorage.setItem('SelectedLoanFeatureId', '')
}
if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
  localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
}else{
  localStorage.setItem('FilterFullSelectedIDs', '');
}

this.filter.loan_feature = this.SelectedLoanFeatureId;
this.filter.count=this.FilterFullSelectedIDs.length;
localStorage.setItem('filter',  JSON.stringify(this.filter));
}


ClearLender(){
  if(this.LoanLenderList && this.LoanLenderList.length>0){
    for(let i=0; i<this.LoanLenderList.length; i++){
      this.LoanLenderList[i].checked=false;
    }
  }
  localStorage.removeItem('SelectedLoanLenderId');
  this.SelectedLoanLenderId=[];
  this.SelectedLoanLenderSize=0;

  if( this.FilterFullSelectedIDs &&  this.FilterFullSelectedIDs.length>0){
    for(let i=0; i<this.FilterFullSelectedIDs.length; i++){
       if(this.FilterFullSelectedIDs[i].type=='LoanLender'){
        this.FilterFullSelectedIDs.splice(i,1);
        --i;
       }
    }
    localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs))

  }

  /********************Update******************** */
  if(this.SelectedLoanLenderId && this.SelectedLoanLenderId.length>0){
    localStorage.setItem('SelectedLoanLenderId', JSON.stringify(this.SelectedLoanLenderId))

    this.SelectedLoanLenderSize=this.SelectedLoanLenderId.length;
  }else{
    this.SelectedLoanLenderSize=0;
    localStorage.setItem('SelectedLoanLenderId', '')
  }

  if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
    localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
  }else{
    localStorage.setItem('FilterFullSelectedIDs', '');
  }

  this.filter.lender = this.SelectedLoanLenderId;
this.filter.count=this.FilterFullSelectedIDs.length;
localStorage.setItem('filter',  JSON.stringify(this.filter));
}


ClearFixedRate(){
  if(this.LoanFixedRateList && this.LoanFixedRateList.length>0){
    for(let i=0; i<this.LoanFixedRateList.length; i++){
      this.LoanFixedRateList[i].checked=false;
    }
  }
  localStorage.removeItem('SelectedFixedRateId');
  this.SelectedFixedRateId=[];
  this.SelectedFixedRateSize=0;

  if( this.FilterFullSelectedIDs &&  this.FilterFullSelectedIDs.length>0){
    for(let i=0; i<this.FilterFullSelectedIDs.length; i++){
       if(this.FilterFullSelectedIDs[i].type=='LoanFixedRate'){
        this.FilterFullSelectedIDs.splice(i,1);
        --i;
       }
    }
    localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs))

  }

  /*********Update********************* */
  if(this.SelectedFixedRateId && this.SelectedFixedRateId.length>0){
    localStorage.setItem('SelectedFixedRateId', JSON.stringify(this.SelectedFixedRateId))

    this.SelectedFixedRateSize=this.SelectedFixedRateId.length;
  }else{
    this.SelectedFixedRateSize=0;
    localStorage.setItem('SelectedFixedRateId', '')
  }

  if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
    localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
  }else{
    localStorage.setItem('FilterFullSelectedIDs', '');
  }

    this.filter.fixedrate = this.SelectedFixedRateId;
    this.filter.count=this.FilterFullSelectedIDs.length;
    localStorage.setItem('filter',  JSON.stringify(this.filter));
}

ClearVariableRate(){
  if(this.LoanVariableRateList && this.LoanVariableRateList.length>0){
    for(let i=0; i<this.LoanVariableRateList.length; i++){
      this.LoanVariableRateList[i].checked=false;
    }
  }
  localStorage.removeItem('SelectedVariableRateId');
  this.SelectedVariableRateId=[];
  this.SelectedVariableRateSize=0;

  if( this.FilterFullSelectedIDs &&  this.FilterFullSelectedIDs.length>0){
    for(let i=0; i<this.FilterFullSelectedIDs.length; i++){
       if(this.FilterFullSelectedIDs[i].type=='VariableRate'){
        this.FilterFullSelectedIDs.splice(i,1);
        --i;
       }
    }
    localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs))

  }

  /**********************************Update********** */
  if(this.SelectedVariableRateId && this.SelectedVariableRateId.length>0){
    localStorage.setItem('SelectedVariableRateId', JSON.stringify(this.SelectedVariableRateId))

    this.SelectedVariableRateSize=this.SelectedVariableRateId.length;
  }else{
    this.SelectedVariableRateSize=0;
    localStorage.setItem('SelectedVariableRateId', '')
  }

  if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
    localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
  }else{
    localStorage.setItem('FilterFullSelectedIDs', '');
  }

  this.filter.variablerate = this.SelectedVariableRateId;
  this.filter.count=this.FilterFullSelectedIDs.length;
  localStorage.setItem('filter',  JSON.stringify(this.filter));
}

ClearLVR(){
  if(this.LoanLVRList && this.LoanLVRList.length>0){
    for(let i=0; i<this.LoanLVRList.length; i++){
      this.LoanLVRList[i].checked=false;
    }
  }
  localStorage.removeItem('SelectedLVRId');
  this.SelectedLVRId=[];
  this.SelectedLVRSize=0;

  if( this.FilterFullSelectedIDs &&  this.FilterFullSelectedIDs.length>0){
    for(let i=0; i<this.FilterFullSelectedIDs.length; i++){
       if(this.FilterFullSelectedIDs[i].type=='LoanLVR'){
        this.FilterFullSelectedIDs.splice(i,1);
        --i;
       }
    }
    localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs))

  }

  /****************Update***************** */
  if(this.SelectedLVRId && this.SelectedLVRId.length>0){
    localStorage.setItem('SelectedLVRId', JSON.stringify(this.SelectedLVRId))

    this.SelectedLVRSize=this.SelectedLVRId.length;
  }else{
    this.SelectedLVRSize=0;
    localStorage.setItem('SelectedLVRId', '')
  }

  if(this.FilterFullSelectedIDs && this.FilterFullSelectedIDs.length>0){
    localStorage.setItem('FilterFullSelectedIDs', JSON.stringify(this.FilterFullSelectedIDs));
  }else{
    localStorage.setItem('FilterFullSelectedIDs', '');
  }

  this.filter.lvr = this.SelectedLVRId;
this.filter.count=this.FilterFullSelectedIDs.length;
localStorage.setItem('filter',  JSON.stringify(this.filter));
}

  /*****************General function********************* */
  delete_by_id(array, key, value) {
    array.some(function(item, index) {
      if(array[index][key] === value){
        // found it!
        array.splice(index, 1);
        return true; // stops the loop
      }
      return false;
    });
    return array;

  }

  delete_by_id_multiple(array, key, value) {
    array.some(function(item, index) {
      if(array[index][key] === value){
        // found it!
        array.splice(index, 1);

      }

    });
    return array;

  }
  objectExists(array, key, value){
    var found = false;
    for(var i = 0; i < array.length; i++) {
        if (array[i].key == 'value') {
            found = true;
            break;
        }
    }

    return found;
  }
}
