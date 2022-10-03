import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ChapterInnerViewComponent } from './chapter-inner-view/chapter-inner-view.component';


const routes:Routes = [
  {
    path: '',
    component:ChapterInnerViewComponent
  }
];

@NgModule({
  declarations: [ChapterInnerViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ChapterInnerViewModule { }
