import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from "src/app/confirm-dialog/confirm-dialog.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private authService: AuthService, private route: ActivatedRoute, public dialog: MatDialog  ) { }

  userAuthenticated = false;
  private authListenerSub: Subscription;

  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.userAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    })
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe()
  }

  onLogout() {
    this.authService.logout()
  }

  confirmDialog(): void {
    const message = `Are you sure you want to logout?`;

    const dialogData = new ConfirmDialogModel("Logout?", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
        this.onLogout()
      } else return
    });
  }

}
