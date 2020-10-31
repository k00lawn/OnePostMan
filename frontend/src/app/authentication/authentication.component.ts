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

  constructor(private fb: FormBuilder, public authService: AuthService ) { }

  ngOnInit(): void {
  }

  onSwitchForm() {
    this.authService.switchForm()
  }

  onLoginSubmit() {
    console.log(this.loginForm.value)
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
  }

  onSignupSubmit() {
    console.log(this.signupForm.value)
    this.authService.signup(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password) 
  }

  

}
