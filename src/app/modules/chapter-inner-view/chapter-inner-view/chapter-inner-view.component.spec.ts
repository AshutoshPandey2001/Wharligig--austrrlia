import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterInnerViewComponent } from './chapter-inner-view.component';

describe('ChapterInnerViewComponent', () => {
  let component: ChapterInnerViewComponent;
  let fixture: ComponentFixture<ChapterInnerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterInnerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterInnerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
