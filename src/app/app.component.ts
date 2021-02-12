import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'smmscheduler';
  
  constructor(private authService: AuthService){}
  
  

  //Move this to new component later
  
  ngOnInit() {
    
  }
  

  

  
}
