import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GravityFormlistComponent } from './gravity-formlist.component';

describe('GravityFormlistComponent', () => {
  let component: GravityFormlistComponent;
  let fixture: ComponentFixture<GravityFormlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GravityFormlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityFormlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
