import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterStampComponent } from './chapter-stamp.component';

describe('ChapterStampComponent', () => {
  let component: ChapterStampComponent;
  let fixture: ComponentFixture<ChapterStampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterStampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
