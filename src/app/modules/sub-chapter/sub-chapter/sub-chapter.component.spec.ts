import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubChapterComponent } from './sub-chapter.component';

describe('SubChapterComponent', () => {
  let component: SubChapterComponent;
  let fixture: ComponentFixture<SubChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
