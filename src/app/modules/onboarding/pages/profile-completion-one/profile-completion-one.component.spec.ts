import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCompletionOneComponent } from './profile-completion-one.component';

describe('ProfileCompletionOneComponent', () => {
  let component: ProfileCompletionOneComponent;
  let fixture: ComponentFixture<ProfileCompletionOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCompletionOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCompletionOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
