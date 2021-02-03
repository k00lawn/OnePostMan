import { Component,  OnInit, OnDestroy } from '@angular/core';
import { ScheduleComponent } from 'src/app/posts/schedule/schedule.component'
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute) { }

  

  openDialog() {
    const dialogRef = this.dialog.open(ScheduleComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigateByUrl('/posts')
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('mode')) {        
        this.openDialog()
      }
    })
  }

}

