import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ScheduleComponent } from './posts/schedule/schedule.component';
import { AuthGuard } from "./services/auth.guard";
import { TasksComponent } from './tasks/tasks.component';
import { PostListComponent } from './posts/post-list/post-list.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'posts', component: PostListComponent, canActivate: [AuthGuard]},
  { path: 'create', component: ScheduleComponent, canActivate: [AuthGuard]},
  { path: 'edit/:postId', component: ScheduleComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'auth', component: AuthenticationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
