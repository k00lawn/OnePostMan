import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  // API endpoint
  private _createTask = "http://localhost:3000/api/createTask"

  constructor(private http: HttpClient) { }

  // POST Request to API endpoint

  createTask(caption: string, date: string, image: File) {
    const postData = new FormData();
    postData.append('caption', caption)
    postData.append('date', date)
    postData.append('image', image)
    return this.http
      .post<{ message: string; postId: string}>(
        this._createTask, postData
      )
  }

  

}
