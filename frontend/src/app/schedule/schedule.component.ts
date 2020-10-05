import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ScheduleService } from 'src/app/services/schedule.service'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  imagePreview: string;

  scheduleForm = new FormGroup({
    caption: new FormControl(''),
    time: new FormControl(''),
    image: new FormControl('')
  })

  constructor( private _createTaskService: ScheduleService) { }

  ngOnInit(): void {
  }

  onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0]
      this.scheduleForm.patchValue({image: file})
      this.scheduleForm.get('image').updateValueAndValidity()
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = <string>reader.result;
      }
      reader.readAsDataURL(file)
  }

  onSubmit() {
    console.log(this.scheduleForm.value)
    if (this.scheduleForm.invalid) {
      return;
    }
    this._createTaskService.createTask(
      this.scheduleForm.value.caption,
      this.scheduleForm.value.date,
      this.scheduleForm.value.image
      )
      .subscribe(
        res => {
          console.log(res)
        },
        err => console.log(err)
      )
  }



}
