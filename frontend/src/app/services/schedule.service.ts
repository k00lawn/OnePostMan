import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  // API endpoint
  private _scheduleTask = "http://localhost:3000/scheduleTask"

  constructor(private http: HttpClient) { }

  // POST Request to API endpoint

  scheduleTask(schedule) {
    return this.http.post<any>(this._scheduleTask, schedule)
  }

  

}
