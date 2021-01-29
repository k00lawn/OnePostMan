import { Component, OnInit, OnDestroy } from "@angular/core";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { Subscription } from "rxjs";
// import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "card-fancy-example",
  templateUrl: "card-fancy-example.html",
  styleUrls: ["card-fancy-example.css"]
})
export class CardFancyExample implements OnInit, OnDestroy {
  mediaSub: Subscription;
  device: string;
  expPanel = 0;
  times = 0;
  url = "";
  caption = "";

  constructor(public mediaObserver: MediaObserver) {}
  ngOnInit() {
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        console.log(result.mqAlias);
        this.device = result.mqAlias;
      }
    );
  }
  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }

  onUpload(pic) {
    if (pic.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(pic.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  whileTyping(event) {
    this.caption = event.target.value;
    this.prev_caption = this.caption;
  }

  open(index: number, el: HTMLElement) {
    if (this.times == 0) {
      this.expPanel = index;
      this.times = 1;
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      this.expPanel = 0;
      this.times = 0;
    }
  }
}

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
