import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Post } from '../models/post'
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  // API endpoint
  private postAPI = "http://localhost:3000/api/postTask"
  private posts: Post[] = []
  private postsUpdated  = new Subject<Post[]>();

  constructor(private http: HttpClient, private authService: AuthService) { }

  // POST Request to API endpoint

  createTask(userId: string, caption: string, time: string, image: File, facebook: string, twitter: string) {
    
    const postData = new FormData();

    postData.append('userId', userId)
    postData.append('caption', caption)
    postData.append('time', time)
    postData.append('image', image)
    postData.append('facebook', facebook)
    postData.append('twitter', twitter)
    
    return this.http
      .post<{ message: string; postId: string}>(
        this.postAPI, postData
      )
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable()
  }

  getPosts() {
    const user_id = this.authService.getUserID()
    this.http.get<{message: String, posts: Post[]}>(
        `${this.postAPI}/${user_id}`
    ).subscribe((postData) => {
      this.posts = postData.posts
      this.postsUpdated.next([...this.posts])
    })
  }

}
