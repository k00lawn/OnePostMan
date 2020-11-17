import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ScheduleService } from 'src/app/services/schedule.service'
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  imagePreview: string = 'https://material.angular.io/assets/img/examples/shiba2.jpg';

  user = {user_id: '', username: '' }
  username = 'Username'
  caption = 'Caption'
  socialMedia = 'Instagram' 

  scheduleForm = this.fb.group({
    userId:[''],
    // username:[''],
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

  constructor(private profileService: ProfileService, private authService: AuthService, private fb: FormBuilder, private _createTaskService: ScheduleService) { }

  ngOnInit() {
    this.authService.autoAuthUser()
    const user_id = this.authService.getUserID()
    console.log(user_id)
    this.user.user_id = user_id
    this.profileService.getProfile(user_id)
      .subscribe(res => {
          console.log(res.username)
          this.user.user_id = res.user_id;
          this.user.username = res.username;
          console.log(this.user)
      })
    
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
    //const userId = this.authService.getUserID()
    const time = this.scheduleForm.get('time').value.toString()
    //const date = this.scheduleForm.get('date').value.toLocaleDateString().toISOString()
    const ISOdate = this.scheduleForm.get('date').value
    const date = new Date(ISOdate.getTime() - (ISOdate.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]

    console.log(`${date} ${time}`)
    // const datetime = date.replace("00:00:00", time)
    // const convDatetime = new Date(datetime).toUTCString().split(' ').slice(1).join(' ')
    const datetime = `${date} ${time}`
    this.scheduleForm.patchValue({userId: this.user.user_id, datetime: datetime})
    console.log(this.scheduleForm.value)
    if (!this.scheduleForm.valid) {
      return;
    }
    this._createTaskService.createTask(
      this.scheduleForm.value.userId,
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

  ngOnDestroy() {
    
  }

}
