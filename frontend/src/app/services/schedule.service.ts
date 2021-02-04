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
  private userId = this.authService.getUserID()

  // POST Request to API endpoint

  createTask(caption: string, date: string, img: File, facebook: string, twitter: string) {
    
    const postData = new FormData();
    

    postData.append('userId', this.userId)
    postData.append('caption', caption)
    postData.append('date', date)
    postData.append('img', img)
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

  updatePost(_id: string, caption: string, date: string, img: File | string, facebook: string, twitter: string) {

      let postData: Post | FormData;
      if(typeof img === "object") {
        postData = new FormData()
        postData.append('_id', _id)
        postData.append('userId', this.userId)
        postData.append('caption', caption)
        postData.append('date', date)
        postData.append('img', img)
        postData.append('facebook', facebook)
        postData.append('twitter', twitter)      
      } else {
        postData = {
          _id: _id,
          userId: this.userId,
          caption: caption,
          date: date,
          img: img,
          facebook: facebook,
          twitter: twitter
        }
      }

      
        
      
      // } else {
      //   postData = {_id: _id, userId: userId, caption: caption, date: date, img: img, facebook: facebook, twitter: twitter }
      // }


    this.http
      .put(`${this.postAPI}/${_id}`, postData)
      .subscribe(res => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p._id === _id);
        const post: Post = {
          _id: _id,
          userId: this.userId,
          caption: caption,
          date: date,
          img: "",
          facebook: facebook,
          twitter: facebook

        }
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
