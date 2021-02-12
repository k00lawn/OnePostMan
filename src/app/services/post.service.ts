import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private mode = new Subject<string>();

  constructor() { }

  getModeListener() {
    return this.mode.asObservable()
  }

  setMode(mode) {
    this.mode.next(mode)
  }
}
