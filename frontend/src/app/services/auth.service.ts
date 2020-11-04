import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginData } from '../models/auth'
import { SignupData } from '../models/auth'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = "http://localhost:3000/api/"

  //Switching Forms
  isLoginForm = false;

  private isAuthenticated = false
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();


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

  switchForm() {
    this.isLoginForm = !this.isLoginForm
  }

  login(email: string, password: string) {
    const loginData: LoginData = { email: email, password: password };
    this.http.post<{token: string, expiresIn: number}>(this.api + 'user/login', loginData) 
      .subscribe(res => {
        console.log(res)
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
    this.http.post<{token: string}>(this.api + 'user/signup', signupData) 
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
}
