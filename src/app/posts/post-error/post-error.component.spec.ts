import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostErrorComponent } from './post-error.component';

describe('PostErrorComponent', () => {
  let component: PostErrorComponent;
  let fixture: ComponentFixture<PostErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
