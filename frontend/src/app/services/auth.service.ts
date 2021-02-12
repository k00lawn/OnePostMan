import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginData } from '../models/auth'
import { SignupData } from '../models/auth'
import { AccessData } from '../models/auth'
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user'
import { Post } from '../models/post';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private nodeApi = environment.apiUrl;
  //private pyApi = "http://localhost:4000/api/accessToken"

  //Switching Forms
  isLoginForm = false;

  private isAuthenticated = false
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  //UserDetails
  //private user_idListener = new BehaviorSubject<any>(undefined);
  private userID: string;

 
  constructor(private http: HttpClient, private router: Router)  { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // getUserIdListener() {
  //   return this.user_idListener.asObservable();
  // }

  getUserID() {
    const lsAuthData = this.getAuthData() 
    return lsAuthData.user_id;
  }

  switchForm() {
    this.isLoginForm = !this.isLoginForm
  }

  login(email: string, password: string) {
    const loginData: LoginData = { email: email, password: password };
    this.http.post<{ user: User, user_id: string, username: string, token: string, expiresIn: number }>(this.nodeApi + '/user/login', loginData) 
      .subscribe((res) => {
        console.log(res)        
        const token = res.token;
        const user_id = res.user_id
        this.token = token;
        if(token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          //this.user_idListener.next(user_id);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
          this.saveAuthData(user_id,token, expirationDate); 
          this.router.navigate(['/posts'])
        }
      })
  }

  signup(username: string, email: string, password: string) {
    const signupData: SignupData = { username: username, email: email, password: password };
    return this.http.post<{token: string}>(this.nodeApi + '/user/signup', signupData) 
      
  }

  logout() {
    //this.user_idListener.next(null)
    this.token = null;
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    this.clearAuthData()
    window.location.reload();
    //this.router.navigate(['/'])
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.userID = authInformation.user_id
      //this.user_idListener.next(this.userID)
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(userID: string,token: string, expirationDate: Date) {
    localStorage.setItem("user_id", userID)
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("user_id")
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const user_id = localStorage.getItem("user_id")
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if ( !token || !expirationDate) {
      return;
    }
    return {
      user_id: user_id,
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }






  //-----------------------TW OAuth----------------------//
  getTWaccessToken() {
    return this.http.get(`${this.nodeApi}/auth/twitter/`)
  }

  saveTWaccessToken(oauthToken: string, oauthVerifier: string) {
    return this.http.get(`${this.nodeApi}/saveAccessTokens/${this.userID}/?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`)
  }
  
  extendAccessToken(userId: any, shortAccessToken: string) {
    console.log(`This is the final object`, shortAccessToken)
    const access_token = { shortAccessToken: shortAccessToken}
    this.http.post(`${this.nodeApi}/auth/facebook/${userId}`, access_token)
    .subscribe(res => {
      console.log(res)
    })
  }

}


//"Http failure response for https://graph.facebook.com/%7Bgraph-api-version%7D/oauth/access_token?%20%20grant_type=fb_exchange_token&%20%20client_id=3431573256929883&%20%20client_secret=c13e000ac59b6d2d8d27ad838a4264ee&%20%20fb_exchange_token=EAAwwZC2kAAlsBAB6SxSqOFttq9M8S0wMuZA7BvS8TZBdniNDXNnPZCua3RgXJLzzeoiWyxFaZCsDEwZBZAk6IWyDVSRBveoUbeqJScwq8dggUAdJZCXgdAgxMVdVFP5pyZCbo5VdLabJPcl2Jbv1ZBam6Xny8eaf7EOd2AacnziFfA20CAjpef1lSqYma26e483Ty95DXxqQbPMQZDZD: 400 OK"

// console.log(this.userData)
// console.log(this.user_idListener)
// const user_id = res.user_id
// this.userID = user_id
//console.log(this.userID)        