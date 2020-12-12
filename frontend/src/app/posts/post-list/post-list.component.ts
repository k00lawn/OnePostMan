import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  isLoading = true

  posts: Post[] = [];
  user: User;
  postsSub: Subscription;
  userSub: Subscription;

  constructor(private authService: AuthService, 
              private profileService: ProfileService, 
              private scheduleService: ScheduleService) { }

  ngOnInit() {
    
    // Getting User 
    this.profileService.getProfile()
    this.userSub = this.profileService.getUserListener()
      .subscribe((user) => {
        this.user = user
        console.log(user)
      });

    // Getting Posts
    this.scheduleService.getPosts()
    this.postsSub = this.scheduleService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false
        this.posts = posts
      })

      console.log(this.posts)
      console.log(this.user)
  }  

  onDeletePost(id) {
    this.scheduleService.deletePost(id)
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
    this.postsSub.unsubscribe()
  }

}
