import { Component, OnInit } from '@angular/core';


declare var FB: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '3431573256929883',
        cookie     : true,
        xfbml      : true,
        version    : 'v8.0'
      });
      FB.AppEvents.logPageView();
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

 submitLogin(){
  console.log("submit login to facebook");
  // FB.login();
  FB.login((response)=>
      {
        console.log('submitLogin',response);
        if (response.authResponse)
        {
          //this.toastr.successToastr('login successful', 'Success!');
          console.log(response.authResponse, 'Success')
        }
         else
         {
         console.log('User login failed');
       }
    });

}

}
