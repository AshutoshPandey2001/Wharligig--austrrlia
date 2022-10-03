import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubChapterComponent } from './sub-chapter/sub-chapter.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path: '',
    component: SubChapterComponent
  }
];

@NgModule({
  declarations: [SubChapterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SubChapterModule { }
