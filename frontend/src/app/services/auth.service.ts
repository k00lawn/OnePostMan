import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginData } from '../models/auth'
import { SignupData } from '../models/auth'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = "http://localhost:3000/api/"

  //Switching Forms
  isLoginForm = false;

  private token: string;

  private authStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  switchForm() {
    this.isLoginForm = !this.isLoginForm
  }

  login(email: string, password: string) {
    const loginData: LoginData = { email: email, password: password };
    this.http.post<{token: string}>(this.api + 'user/login', loginData) 
      .subscribe(res => {
        console.log(res)
        this.token = res.token
        this.authStatusListener.next(true);

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
      })
  }

}
