import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  //API endpoint
  private _userapi = "http://localhost:3000/api/user/"
  constructor(private http: HttpClient, private authService: AuthService) { }

  //get user data

  getUser(user_id){
    return this.http.get<{user_id: string, username: string}>(this._userapi + user_id)
  }
}
