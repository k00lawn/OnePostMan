import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginData } from '../models/auth'
import { SignupData } from '../models/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Switching Forms
  isLoginForm = false;

  private api = "http://localhost:3000/api/"

  constructor(private http: HttpClient) { }

  switchForm() {
    this.isLoginForm = !this.isLoginForm
  }

  login(email: string, password: string) {
    const loginData: LoginData = { email: email, password: password };
    this.http.post(this.api + 'user/login', loginData) 
      .subscribe(res => {
        console.log(res)
      })
  }

  signup(username: string, email: string, password: string) {
    const signupData: SignupData = { username: username, email: email, password: password };
    this.http.post(this.api + 'user/signup', signupData) 
      .subscribe(res => {
        console.log(res)
      })
  }

}
