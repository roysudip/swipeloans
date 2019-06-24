import { Http, Response,RequestOptions ,Headers} from '@angular/http';
import { Injectable } from '@angular/core';

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
export class WebserviceProvider {
  baseURL='http://nodeserver.brainiuminfotech.com:6006';
  constructor(public http: Http) {

  }

  private _errorHandler(error: Response) {
    return Observable.throw(error || "Server Error");
  }
  getBaseURL(){
    return this.baseURL;
  }
  signup(data){

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    //console.log(data);
    // http://162.243.110.92:6006/
    //https://swipeloansadmin.com.au:6006/
    //http://139.162.216.58:6006/
    var url = this.baseURL+'/api/user/login';
    return this.http.post(url,data,options)
    .map((response: Response) => response.json())
    .catch(this._errorHandler);
  }

  signuptest(data){

  }

// verify user account
  verificationcode(data){

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    var url = this.baseURL+'/api/user/email-varification';
    return this.http.post(url,data,options)
    .map((response: Response) => response.json())
    .catch(this._errorHandler);
  }

// update profile details
  updateprofiledata(data){
    //console.log(data);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        var url = this.baseURL+'/api/user/edit-profile?token='+data.user_token;
        return this.http.post(url,data,options)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);

      }

// user profile details
      getprofiledetails(data){
        //console.log(data);
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let options = new RequestOptions({ headers: headers });

            var url = this.baseURL+'/api/user/profile-details?token='+data.user_token+'&user_id='+data.user_id;
            return this.http.get(url)
            .map((response: Response) => response.json())
            .catch(this._errorHandler);

          }

  //  get all loan type

      getallloantypeservice(data){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        var url = this.baseURL+'/api/loan/loan-type-list?token='+data.user_token;
        return this.http.get(url)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
      }

      // get all favorite loan list

      getallfavoriteloans(data){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        var url = this.baseURL+'/api/loan/list-favorite?token='+data.user_token;
        return this.http.post(url,data,options)
        .map((response: Response) => response.json())
        .catch(this._errorHandler);
      }

     // dashboard loan search

     loanserach(data, start, limit){

      if(data.min_value){
        data.min_value=data.min_value.split(',').join('');
      }

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/get-all-loan-search?token='+data.user_token+'&page='+start+'&limit='+limit;;

      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
     }

     BookAppoinment(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      var url = this.baseURL+'/api/loan/book-an-appointment?token='+data.user_token;


      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
     }

     // show loan details

     showloandetails(data){
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');
          let options = new RequestOptions({ headers: headers });

          var url = this.baseURL+'/api/loan/loan-details?token='+data.user_token+'&loan_id='+data.loan_id;
          return this.http.get(url)
          .map((response: Response) => response.json())
          .catch(this._errorHandler);
     }

     // save as favourite loan

     saveasfavloan(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/add-favorite?token='+data.user_token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    // remove favourite loan from favourite list

    removefavloanfromfavlist(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/remove-favorite?token='+data.user_token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

    }

    // remove favourite loan from favourite list

    loanfavchecking(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/check-fav-loan?token='+data.user_token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

    }

    //get max loan value
    getmaxloanval(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/max-capacity-value?token='+data.user_token;
      return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    // get content data

    getcontentdata(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      var url = this.baseURL+'/api/cms/content-details?token='+data.user_token+'&slug='+data.slug;

      return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    // get FAQ content     /cms/faq

    getfaqcontent(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/cms/faq';
      return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

     //  get all loan features
     getallloanfeaturesservice(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/get-all-loan-featuresfrontend/?token='+data.user_token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    //  get all loan features
    getallloanratioservice(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/get-all-loan-ratio?token='+data.user_token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    //  get all loan features
    getallloanlenderservice(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/get-all-loan-lenders?token='+data.user_token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    getallloanfixedrateservice(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/get-all-loan-rateoftermsfrontend?token='+data.user_token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    getallloanvariablerateservice(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/get-all-loan-variableratefrontend?token='+data.user_token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    // get filter result
    getfilterresult(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/get-all-loan-search/?token='+data.user_token;

      return this.http.post(url,data,options)

      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

     // send property report
     sendpropertyreport(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      //console.log(data);
      var url = this.baseURL+'/api/report/send-report/?token='+data.user_token;
      return this.http.post(url,data,options)

      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    // get all questions
    getallquestionsdata(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      var url = this.baseURL+'/api/question/get-all-questions?token='+data.user_token;
      return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    getAllApplyQuestion(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      var url = this.baseURL+'/api/question/get-all-apply-questions?token='+data.user_token;
      return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    //submit questions answers
    saveuserquestionans(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/question/submission?token='+data.user_token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    SaveApplyQuestion(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/apply_answer/saveapplyquestion?token='+data.user_token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }

    lendername(data){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      var url = this.baseURL+'/api/loan/lendername/'+data.loan_id+'?token='+data.user_token;
      return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
 }

getmyappliedloan(data){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let options = new RequestOptions({ headers: headers });

  var url = this.baseURL+'/api/apply_answer/get-all-applyloan-list?token='+data.user_token;
  return this.http.post(url,data,options)
  .map((response: Response) => response.json())
  .catch(this._errorHandler);
}

getMyQuestionAnswer(data){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let options = new RequestOptions({ headers: headers });

  var url = this.baseURL+'/api/apply_answer/get-all-applyloan-qstnansr/'+data.listingId+'/?token='+data.user_token

  return this.http.get(url)
  .map((response: Response) => response.json())
  .catch(this._errorHandler);
}

getmyappliedborrow(data){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let options = new RequestOptions({ headers: headers });

  var url = this.baseURL+'/api/question/get-all-borrowloan-list?token='+data.user_token;
  return this.http.post(url,data,options)
  .map((response: Response) => response.json())
  .catch(this._errorHandler);
}

getMyBorrowQuestionAnswer(data){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let options = new RequestOptions({ headers: headers });

  var url = this.baseURL+'/api/question/get-all-borrow-qstnansr/'+data.listingId+'/?token='+data.user_token

  return this.http.get(url)
  .map((response: Response) => response.json())
  .catch(this._errorHandler);
}

getloanlist(data){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let options = new RequestOptions({ headers: headers });
  var url = this.baseURL+'/api/loan/list?token='+data.user_token

  return this.http.get(url)
  .map((response: Response) => response.json())
  .catch(this._errorHandler);

}

  SaveYourPhonenumber(data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    var url = this.baseURL+'/api/user/update-phone/?token='+data.user_token;
    return this.http.post(url,data,options)
    .map((response: Response) => response.json())
    .catch(this._errorHandler);
  }

  updatepromocode(data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    var url = this.baseURL+'/api/user/update-promo-code/?token='+data.user_token;

    return this.http.post(url,data,options)
    .map((response: Response) => response.json())
    .catch(this._errorHandler);

  }

  getMynotification(token){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    var url = this.baseURL+'/api/all_notification/get-my-notification?token='+token;

    return this.http.get(url)
    .map((response: Response) => response.json())
    .catch(this._errorHandler);
  }

  deleteMyNotification(data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    var url = this.baseURL+'/api/all_notification/deletenotificationbyuser/'+data.notification_id+'?token='+data.token;

    return this.http.delete(url)
    .map((response: Response) => response.json())
    .catch(this._errorHandler);
  }

  updateMyNotification(data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    var url = this.baseURL+'/api/all_notification/update-notificationstatus/'+data.notification_id+'?token='+data.token;

    return this.http.get(url)
    .map((response: Response) => response.json())
    .catch(this._errorHandler);

  }

  checkOTP(data){

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    var url = this.baseURL+'/api/user/checkOTP/?token='+data.user_token;

    return this.http.post(url,data,options)
    .map((response: Response) => response.json())
    .catch(this._errorHandler);

}
getSocialLinkURLService(user_token){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let options = new RequestOptions({ headers: headers });

  var url = this.baseURL+'/api/social/get-all-social-url/?token='+user_token+'';

  return this.http.get(url)
  .map((response: Response) => response.json())
  .catch(this._errorHandler);

}

get_admin_detail(user_token){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let options = new RequestOptions({ headers: headers });

  var url = this.baseURL+'/api/user/admindetail?token='+user_token+'';


  return this.http.get(url)
  .map((response: Response) => response.json())
  .catch(this._errorHandler);
  }

  /******************************* */

  ReplyNotificationService2(data, user_token){

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    var url = this.baseURL+'/api/all_notification/reply-against-notification/?token='+user_token;

    return this.http.post(url,data,options)
  .map((response: Response) =>
  response.json())
    .catch(this._errorHandler);
}

ReplyNotificationService(data, user_token){

  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let options = new RequestOptions({ headers: headers });

  var url = this.baseURL+'/api/all_notification/reply-against-notification/?token='+user_token;

  return this.http.post(url,data,options)
  .map((response: Response) => response.json())
  .catch(this._errorHandler);

}
/***************Logout********** */

logout(user_token){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let options = new RequestOptions({ headers: headers });

  var url = this.baseURL+'/api/user/logout/?token='+user_token+'';


  return this.http.get(url)
  .map((response: Response) => response.json())
  .catch(this._errorHandler);
  }

/******************user faq question*********************** */

SendUserFaqQuestion(data, token){
  //console.log(data);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      var url = this.baseURL+'/api/userqstn/user_faq/?token='+token;
      return this.http.post(url,data,options)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);

    }

    getmoreinforloanservice(user_token, LoanId){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      var url = this.baseURL+'/api/loan/getmoreinfoloanbroker/?token='+user_token+'&loan_id='+LoanId+'';

      return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
    }
/**************State List***************** */
getStateList(user_token){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let options = new RequestOptions({ headers: headers });

  var url = this.baseURL+'/api/loan/statename/?token='+user_token+'';
  return this.http.get(url)
  .map((response: Response) => response.json())
  .catch(this._errorHandler);
  }


PriceMasker(f) {
  var f_val = f.toString();

  //f_val=f_val.replace(/\D[^\.]/g, "");
  if(f_val.length<=3){
    return f_val.length;
  }else if(f_val.length>3 && f_val.length<=6){

    return f_val.slice(0, 3) + "," + f_val.slice(3, 6);
  }else{
    return f_val.slice(0, 3) + "," + f_val.slice(3, 6) + "," + f_val.slice(6);
  }

}

ThousandSeparator(x:any) {

  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //return x.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');

}
isValidprice(inputtxt) {
  var re = /^\d+(?:\.\d{0,2})$/;
  return re.test(String(inputtxt));
}
}
