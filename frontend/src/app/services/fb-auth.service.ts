// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class FbAuthService {

//   constructor(private http: HttpClient) {}

//   //AccessTokens
//   private fbAccessToken: string = '';
//   private app_id = '3431573256929883'
//   private app_secret = 'c13e000ac59b6d2d8d27ad838a4264ee'
//   //private fbExtUrl = `https://graph.facebook.com/v8.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.app_id}&client_secret=${this.app_secret}&fb_exchange_token=`
//   private fbExtUrl = `https://graph.facebook.com/v8.0/oauth/access_token?grant_type=fb_exchange_token&client_id=3431573256929883&client_secret=c13e000ac59b6d2d8d27ad838a4264ee&fb_exchange_token=`

//   extendAccessToken(shortAccessToken: string) {
//     console.log(`${this.fbExtUrl}${shortAccessToken}`)
//     this.http.get(`${this.fbExtUrl}${shortAccessToken}`)
//     .subscribe(res => {
//       console.log(res)
//       console.log(`Short Access Token = ${shortAccessToken}, Long Access Token = ${res}`)
//     })
//   }

// }