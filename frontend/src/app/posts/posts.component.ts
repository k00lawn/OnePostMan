import { Component,  OnInit, OnDestroy } from '@angular/core';
import { ScheduleComponent } from 'src/app/posts/schedule/schedule.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  private mode = "create";
  private postId: string

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute) { }
  
  

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
  }

}

