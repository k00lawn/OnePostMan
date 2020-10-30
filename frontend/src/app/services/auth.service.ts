import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoginForm = false;

  constructor() { }

  switchForm() {
    this.isLoginForm = !this.isLoginForm
  }

  // switchToLogin(){
  //   this.isLoginForm = true
  // }

}
