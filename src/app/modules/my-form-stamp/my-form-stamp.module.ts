import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFormStampComponent } from './my-form-stamp/my-form-stamp.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
];

@NgModule({
  declarations: [MyFormStampComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [MyFormStampComponent]
})
export class MyFormStampModule { }
