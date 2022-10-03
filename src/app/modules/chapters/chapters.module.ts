import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChaptersComponent } from './pages/chapters/chapters.component';
import { RouterModule, Routes } from '@angular/router';
import { ChapterStampModule } from '../chapter-stamp/chapter-stamp.module';
import { EmptyPlaceholderModule } from '../empty-placeholder/empty-placeholder.module';

const routes:Routes	= [
	{
		path: '',
		component:ChaptersComponent
	}
];

@NgModule({
  declarations: [ChaptersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChapterStampModule,
    EmptyPlaceholderModule
  ]
})
export class ChaptersModule { }
