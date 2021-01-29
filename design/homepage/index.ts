import { Component, OnDestroy, OnInit } from "@angular/core";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { Subscription } from "rxjs";

/**
 * @title Card with multiple sections
 */
@Component({
  selector: "card-fancy-example",
  templateUrl: "card-fancy-example.html",
  styleUrls: ["card-fancy-example.css"]
})
export class CardFancyExample implements OnInit, OnDestroy {
  device: string;
  mediasub: Subscription;
  fxlayout = "row";
  fxalign = "space-around center";

  constructor(public mediaobs: MediaObserver) {}
  ngOnInit() {
    this.mediasub = this.mediaobs.media$.subscribe((result: MediaChange) => {
      this.device = result.mqAlias;

      if (this.device === "xs") {
        this.fxlayout = "column";
      }
    });
  }
  ngOnDestroy() {
    this.mediasub.unsubscribe;
  }
}

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
