import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Post } from '../models/post'
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private posts: Post[] = []
  private postsUpdated  = new Subject<Post[]>();

  constructor(private http: HttpClient, private authService: AuthService) { }

  // API endpoint
  private postAPI = "http://localhost:3000/api/postTask"

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

  getPost(id: string) {
    return this.http.get<{post: Post}>(`${this.postAPI}/post/${id}`)
  }

  updatePost(id: string, userId: string, caption: string, date: string, img: File, facebook: boolean, twitter: boolean) {
    const post: Post = {_id: id, userId: userId, caption: caption, date: date, img: img, facebook: facebook, twitter: twitter }

    this.http
      .put(`${this.postAPI}/${id}`, post)
      .subscribe(res => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(post => post._id === post._id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts ])
      })
  }

  deletePost(post_id: string) {
    this.http
      .delete(`${this.postAPI}/${post_id}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post._id !== post_id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }

}
