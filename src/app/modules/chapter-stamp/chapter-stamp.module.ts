import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterStampComponent } from './pages/chapter-stamp/chapter-stamp.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
];

@NgModule({
	declarations: [ChapterStampComponent],
	imports: [
		CommonModule,
    RouterModule.forChild(routes)
	],
	exports: [
		ChapterStampComponent
	]
})
export class ChapterStampModule { }
