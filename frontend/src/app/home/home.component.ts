import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaObserver,MediaChange } from '@angular/flex-layout'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {
  device: string;
  mediaobs:Subscription;
  fxlayout = "row";
  fxalign = "space-around center";

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: "smooth" });
  }

}
