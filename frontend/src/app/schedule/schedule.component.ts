import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ScheduleService } from 'src/app/services/schedule.service'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  scheduleForm = new FormGroup({
    caption: new FormControl(''),
    time: new FormControl('')
  })

  constructor( private _schedule: ScheduleService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.scheduleForm.value)
    this._schedule.scheduleTask(this.scheduleForm.value)
      .subscribe(
        res => {
          console.log(res)
        },
        err => console.log(err)
      )
  }



}
