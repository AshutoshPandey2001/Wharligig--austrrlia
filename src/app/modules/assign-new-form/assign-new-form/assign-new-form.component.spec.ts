import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignNewFormComponent } from './assign-new-form.component';

describe('AssignNewFormComponent', () => {
  let component: AssignNewFormComponent;
  let fixture: ComponentFixture<AssignNewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignNewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
