import { Component,  OnInit, OnDestroy } from '@angular/core';
import { ScheduleComponent } from 'src/app/posts/schedule/schedule.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ScheduleService } from '../services/schedule.service';
import { Post } from '../models/post';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  private mode = "create";
  private postId: string
  postsSub: Subscription;
  posts: Post[] = [];


  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private scheduleService: ScheduleService) { }
  
  

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { mode: this.mode, postId: this.postId}
    const dialogRef = this.dialog.open(ScheduleComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigateByUrl('/posts')
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.openDialog()
      }
    })
    console.log(this.posts)

    // Getting Posts
    this.scheduleService.getPosts()
    this.postsSub = this.scheduleService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts
      })
  }

}

