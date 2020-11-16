import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

declare var FB: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      const oauthVerifier = params['oauth_verifier'];
      const oauthToken = params['oauth_token'];
      if (oauthToken && oauthVerifier) {
        console.log(oauthToken, oauthVerifier)
        this.saveTWAccessToken(oauthToken, oauthVerifier);
      }
    });
  }

  private userIdListenerSub: Subscription;
  userAuthenticated = false;
  private authListenerSub: Subscription
  userID: string;


  //Initialize Profile Component

  ngOnInit() {

    this.authService.autoAuthUser();
    // this.userAuthenticated = this.authService.getIsAuth();
    // this.authListenerSub = this.authService
    // .getAuthStatusListener()
    // .subscribe(isAuthenticated => {
    //   this.userAuthenticated = isAuthenticated;
    // });
    this.userIdListenerSub = this.authService
      .getUserIdListener()
      .subscribe(user_id => {
        this.userID = user_id;
      });

    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '3431573256929883',
        cookie     : true,
        xfbml      : true,
        version    : 'v8.0'
      });
        
      FB.AppEvents.logPageView();   
        
    };
    

    // FB OAuth Request
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

     // Twitter OAuth Request

  }



  //Access Data
  

  //Facebook OAuth

  fbAuth() {
    console.log("submit login to facebook");
    FB.login()
    FB.getLoginStatus((response) => {
      if(response.authResponse.accessToken) {
        const shortAccessToken = response.authResponse.accessToken
        const userID = this.authService.getUserID()
        console.log(`Short Access Token = ${shortAccessToken} and User = ${userID}`)
        this.authService.extendAccessToken(userID, shortAccessToken) 
      }
    });
  }

  // Twitter OAuth

  saveTWAccessToken(oauthToken: string, oauthVerifier: string) {
    console.log(oauthToken, oauthVerifier)
    this.authService.saveTWaccessToken(oauthToken, oauthVerifier).subscribe(res => {
      console.log(res)
      alert('Token saved');
    })
  }

  twAuth() {
    console.log("Authenticating twitter...")
    this.authService.getTWaccessToken()
      .subscribe((res: any) => {
        location.href = res.redirectUrl;
      })
  }


  // Exit Profile Component

  ngOnDestroy() {
    //this.authListenerSub.unsubscribe()
    this.userIdListenerSub.unsubscribe()
  }

}





// FB.login();
  // FB.login((response)=>
  //     {
  //       console.log('submitLogin',response);
  //       if (response.authResponse)
  //       {
  //         //this.toastr.successToastr('login successful', 'Success!');
  //         console.log(response.authResponse, 'Success')
  //       }
  //        else
  //        {
  //        console.log('User login failed');
  //      }
  //   });