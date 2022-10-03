import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignedFormStampComponent } from './assigned-form-stamp/assigned-form-stamp.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
];


@NgModule({
  declarations: [AssignedFormStampComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],exports: [
    AssignedFormStampComponent
  ]
})
export class AssignedFormStampModule { }
