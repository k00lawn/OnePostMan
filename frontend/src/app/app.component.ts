import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'smmscheduler';
  
  constructor(private authService: AuthService){}
  
  switchToLogin(){
    if(!this.authService.isLoginForm)
    this.authService.switchForm()
  }

  switchToSignup() {
    if (this.authService.isLoginForm) {
      this.authService.switchForm()
    }
  }

  //Move this to new component later
  userAuthenticated = false;
  private authListenerSub: Subscription;
  ngOnInit() {
    this.authService.autoAuthUser();
    this.userAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    })
  }
  ngOnDestroy() {
    this.authListenerSub.unsubscribe()
  }

  onLogout() {
    this.authService.logout()
  }

  
}
