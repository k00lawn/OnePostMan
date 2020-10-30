import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit {

  

  signupForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required, Validators.email],
    password: ['', Validators.required],
  })

  loginForm = this.fb.group({
    email: ['', Validators.required, Validators.email],
    password: ['', Validators.required],
  })

  // getErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }

  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

  constructor(private fb: FormBuilder, public authService: AuthService ) { }

  ngOnInit(): void {
  }

  onSwitchForm() {
    this.authService.switchForm()
  }

  onSignupSubmit() {

  }

  onLoginSubmit() {

  }

}
