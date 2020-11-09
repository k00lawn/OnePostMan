import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ScheduleService } from 'src/app/services/schedule.service'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  imagePreview: string = 'https://material.angular.io/assets/img/examples/shiba2.jpg';

  username = 'Username'
  caption = 'Caption'
  socialMedia = 'Instagram' 

  scheduleForm = this.fb.group({
    username:[''],
    caption: [''],
    datetime: [''],
    time: [''],
    date: [''],
    socialMedia: new FormArray([
      new FormControl(''),
      new FormControl(''),
      new FormControl('')
    ]),
    image: [''],
    facebook: [false],
    instagram: [false],
    twitter: [false]
  })

  constructor( private fb: FormBuilder, private _createTaskService: ScheduleService) { }

  ngOnInit() {
    
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
    const time = this.scheduleForm.get('time').value.toString()
    //const date = this.scheduleForm.get('date').value.toLocaleDateString().toISOString()
    const ISOdate = this.scheduleForm.get('date').value
    const date = new Date(ISOdate.getTime() - (ISOdate.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]

    console.log(`${date} ${time}`)
    // const datetime = date.replace("00:00:00", time)
    // const convDatetime = new Date(datetime).toUTCString().split(' ').slice(1).join(' ')
    const datetime = `${date} ${time}`
    this.scheduleForm.patchValue({datetime: datetime})
    console.log(this.scheduleForm.value)
    if (!this.scheduleForm.valid) {
      return;
    }
    this._createTaskService.createTask(
      this.scheduleForm.value.username,
      this.scheduleForm.value.caption,
      this.scheduleForm.value.datetime,
      this.scheduleForm.value.image,
      this.scheduleForm.value.facebook,
      this.scheduleForm.value.instagram,
      this.scheduleForm.value.twitter,
      )
      .subscribe(
        res => { 
          console.log(res)
          this.scheduleForm.reset()
        }, err => console.log(err)
      )
  }



}
