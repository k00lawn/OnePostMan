import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginData } from '../models/auth'
import { SignupData } from '../models/auth'
import { AccessData } from '../models/auth'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private nodeApi = "http://localhost:3000/api/";
  private pyApi = "http://localhost:4000/api/accessToken"

  //Switching Forms
  isLoginForm = false;

  private isAuthenticated = false
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  //UserDetails
  private usernameListener = new Subject<string>()
  private user_idListener = new Subject<string>()
  userID: string;

 
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

  getUsername(){
    return this.usernameListener.asObservable();
  }

  getUserId() {
    return this.user_idListener.asObservable();
  }

  switchForm() {
    this.isLoginForm = !this.isLoginForm
  }

  login(email: string, password: string) {
    const loginData: LoginData = { email: email, password: password };
    this.http.post<{user_id: string, username: string,token: string, expiresIn: number}>(this.nodeApi + 'user/login', loginData) 
      .subscribe(res => {
        console.log(res)
        this.usernameListener.next(res.username);
        //this.user_idListener.next(res.user_id)
        //console.log(this.user_idListener)
        const user_id = res.user_id
        this.userID = user_id
        console.log(this.userID)
        const token = res.token;
        this.token = token;
        if(token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
          this.saveAuthData(token, expirationDate); 
          this.router.navigate(['/create'])
        }
      })
  }

  signup(username: string, email: string, password: string) {
    const signupData: SignupData = { username: username, email: email, password: password };
    this.http.post<{token: string}>(this.nodeApi + 'user/signup', signupData) 
      .subscribe(res => {
        console.log(res)
        this.token = res.token;
        this.authStatusListener.next(true);
        console.log(this.authStatusListener)
        this.router.navigate(['/create'])
      })
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    this.clearAuthData()
    this.router.navigate(['/'])
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
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

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  extendAccessToken(userId: any, access_token: string) {
    const accessData: AccessData = { userId: userId, access_token: access_token}
    console.log(`This is the final object`, accessData)
    console.log(this.userID)
    this.http.post(this.pyApi, accessData)
    .subscribe(res => {
      console.log(res)
    })
  }

  

}


//"Http failure response for https://graph.facebook.com/%7Bgraph-api-version%7D/oauth/access_token?%20%20grant_type=fb_exchange_token&%20%20client_id=3431573256929883&%20%20client_secret=c13e000ac59b6d2d8d27ad838a4264ee&%20%20fb_exchange_token=EAAwwZC2kAAlsBAB6SxSqOFttq9M8S0wMuZA7BvS8TZBdniNDXNnPZCua3RgXJLzzeoiWyxFaZCsDEwZBZAk6IWyDVSRBveoUbeqJScwq8dggUAdJZCXgdAgxMVdVFP5pyZCbo5VdLabJPcl2Jbv1ZBam6Xny8eaf7EOd2AacnziFfA20CAjpef1lSqYma26e483Ty95DXxqQbPMQZDZD: 400 OK"