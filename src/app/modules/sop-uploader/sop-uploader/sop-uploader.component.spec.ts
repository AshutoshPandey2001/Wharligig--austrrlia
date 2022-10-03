import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SopUploaderComponent } from './sop-uploader.component';

describe('SopUploaderComponent', () => {
  let component: SopUploaderComponent;
  let fixture: ComponentFixture<SopUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
