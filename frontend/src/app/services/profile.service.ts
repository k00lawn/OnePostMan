import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  //API endpoint

  private _profileapi = "http://localhost:3000/api/profile/"
  constructor(private http: HttpClient, private authService: AuthService) { }

  //get user data

  getProfile(user_id) {
    return this.http.get<{user_id: string, username: string, fb_provider: boolean, tw_provider: boolean}>
      (this._profileapi + user_id)
  }

  removeFBaccount(user_id) {
    return this.http.delete<{fb_provider: boolean}>
      (`${this._profileapi}/fbrevoke/${user_id}`)
  }
  
  removeTWaccount(user_id) {
    return this.http.delete<{tw_provider: boolean}>
      (`${this._profileapi}/twrevoke/${user_id}`)
  }


}
