import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetGravityFormbyIdComponent } from './get-gravity-formby-id.component';

describe('GetGravityFormbyIdComponent', () => {
  let component: GetGravityFormbyIdComponent;
  let fixture: ComponentFixture<GetGravityFormbyIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetGravityFormbyIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetGravityFormbyIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
