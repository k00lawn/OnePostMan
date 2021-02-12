import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service'
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  accountCreated: Boolean;
  userAuthenticated = false;
  private authListenerSub: Subscription;
  formType: string;
  
  signupForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  constructor(private fb: FormBuilder, public authService: AuthService, private router: Router, private route: ActivatedRoute ) { }


  ngOnInit() {

    // this.route.url.subscribe(url => {
    //   console.log(url, 'url')
    // })
    console.log(this.router.url)
    
    this.formType = this.router.url;

    this.accountCreated = false
    this.authService.autoAuthUser();
    this.userAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    })

    if(this.userAuthenticated) {
      this.router.navigateByUrl('/posts')
    }
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe()
  }


  onLoginSubmit() {
    console.log(this.loginForm.value)
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
  }

  // onSignupSubmit() {
  //   console.log(this.signupForm.value)
  //   this.authService.signup(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password) 
  //     .subscribe(res => {
  //       this.accountCreated = true
  //     })
  // }

  

}
