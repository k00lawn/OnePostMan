import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
}
