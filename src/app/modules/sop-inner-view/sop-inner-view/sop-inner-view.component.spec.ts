import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SopInnerViewComponent } from './sop-inner-view.component';

describe('SopInnerViewComponent', () => {
  let component: SopInnerViewComponent;
  let fixture: ComponentFixture<SopInnerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopInnerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopInnerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
