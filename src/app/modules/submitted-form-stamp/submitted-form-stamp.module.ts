import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmittedFormStampComponent } from './pages/submitted-form-stamp/submitted-form-stamp.component';


@NgModule({
  declarations: [SubmittedFormStampComponent],
  imports: [
    CommonModule
  ],exports: [
  	SubmittedFormStampComponent
  ]
})
export class SubmittedFormStampModule { }
