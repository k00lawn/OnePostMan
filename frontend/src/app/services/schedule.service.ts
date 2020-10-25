import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  // API endpoint
  private _createTask = "http://localhost:3000/api/postTask"

  constructor(private http: HttpClient) { }

  // POST Request to API endpoint

  createTask(caption: string, time: string, image: File, facebook: string, instagram: string, twitter: string, username: string) {
    const postData = new FormData();
    postData.append('caption', caption)
    postData.append('time', time)
    postData.append('image', image)
    postData.append('facebook', facebook)
    postData.append('instagram', instagram)
    postData.append('twitter', twitter)
    postData.append('username', username)
    return this.http
      .post<{ message: string; postId: string}>(
        this._createTask, postData
      )
  }

  

}
