import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  device: string;
  mediaobs: Subscription;
  fxlayout = 'row';
  fxalign = 'space-around center';

  constructor(private authService: AuthService, private router: Router) {}

  userAuthenticated = false;
  private authListenerSub: Subscription;

  ngOnInit() {
    this.authService.autoAuthUser();
    this.userAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userAuthenticated = isAuthenticated;
      });

    if (this.userAuthenticated) {
      this.router.navigateByUrl('/posts');
    }
  }

  ngOnDestroy() {}

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
