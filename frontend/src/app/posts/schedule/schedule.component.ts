import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { ScheduleService } from 'src/app/services/schedule.service'
import { ProfileService } from '../../services/profile.service'
import { mimeType } from "./mime-type.validator";


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  @ViewChild('filePicker') filePicker: ElementRef;

  private mode = 'create'
  private postId: string;
  post: Post;

  imagePreview: string = 'https://material.angular.io/assets/img/examples/shiba2.jpg';
  
  
  
  scheduleForm = this.fb.group({
    caption: ['caption'],
    datetime: [''],
    time: [''],
    date: [''],
    socialMedia: new FormArray([
      new FormControl(''),
      new FormControl(''),
      new FormControl('')
    ]),
    image: new FormControl(null, {
      // asyncValidators: [mimeType]
    }),
    facebook: [false],
    twitter: [false]
  })

  constructor(private profileService: ProfileService, 
              private fb: FormBuilder, 
              private scheduleService: ScheduleService,
              private route: ActivatedRoute) { }

  user: User;
  userSub: Subscription;
  caption = 'Caption' 
  socialMedia = 'Facebook'              

  ngOnInit() {

    // Get Profile info
    this.profileService.getProfile()
    this.userSub = this.profileService.getUserListener()
      .subscribe((user) => {
        this.user = user
      })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.scheduleService.getPost(this.postId).subscribe((postData: any) => {
          this.post = postData
        })
      } else {
        this.mode = 'create'
        this.scheduleForm.patchValue({facebook: false, twitter: false})
      }
    })

    
  }

  onImagePicked(event) {
      const file = (event.target as HTMLInputElement).files[0]
      this.scheduleForm.patchValue({image: file})
      this.scheduleForm.get("image").updateValueAndValidity()
      console.log(file)      
      const reader = new FileReader()   
      reader.onload = () => {
        console.log('hello there')
        this.imagePreview = reader.result as string;
      }
      reader.readAsDataURL(file);
      
  }

  resetForm() {
    this.scheduleForm.reset()
    this.scheduleForm.patchValue({facebook: false, twitter: false}) 
    this.filePicker.nativeElement.value = "";
  }

  onSubmit() {
    const time = this.scheduleForm.get('time').value.toString()
    const ISOdate = this.scheduleForm.get('date').value
    const date = new Date(ISOdate.getTime() - (ISOdate.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]

    
    const datetime = `${date} ${time}`
    this.scheduleForm.patchValue({datetime: datetime})
    console.log(this.scheduleForm.value)
    // const date = this.scheduleForm.get('date').value.toLocaleDateString().toISOString()
    // const datetime = date.replace("00:00:00", time)
    // const convDatetime = new Date(datetime).toUTCString().split(' ').slice(1).join(' ')  
    if (!this.scheduleForm.valid) {
      return;
    }

    if(this.mode === 'create'){
      this.scheduleService.createTask(
        this.scheduleForm.value.caption,
        this.scheduleForm.value.datetime,
        this.scheduleForm.value.image,
        this.scheduleForm.value.facebook,
        this.scheduleForm.value.twitter,
        )
        .subscribe(
          res => { 
            console.log(res)
            alert(res.message)
          }, err => console.log(err)
        )
    } else {
        this.scheduleService.updatePost(
          this.postId,        
          this.scheduleForm.value.caption,
          this.scheduleForm.value.datetime,
          this.scheduleForm.value.image,
          this.scheduleForm.value.facebook,
          this.scheduleForm.value.twitter,
        )
    }
    this.resetForm()
    this.imagePreview = 'https://material.angular.io/assets/img/examples/shiba2.jpg'   
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

}
