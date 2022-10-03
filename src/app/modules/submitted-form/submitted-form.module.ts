import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmittedFormStampModule } from '../submitted-form-stamp/submitted-form-stamp.module';
import { SubmittedFormComponent } from './pages/submitted-form/submitted-form.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes	= [
{
	path: '',
	component:SubmittedFormComponent
}
];
@NgModule({
  declarations: [SubmittedFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SubmittedFormStampModule
  ]
})
export class SubmittedFormModule { }
