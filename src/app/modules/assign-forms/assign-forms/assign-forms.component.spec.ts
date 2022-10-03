import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFormsComponent } from './assign-forms.component';

describe('AssignFormsComponent', () => {
  let component: AssignFormsComponent;
  let fixture: ComponentFixture<AssignFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
