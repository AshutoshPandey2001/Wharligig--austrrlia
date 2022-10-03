import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFormsComponent } from './my-forms/my-forms.component';
import { RouterModule, Routes } from '@angular/router';
import { MyFormStampModule } from '../my-form-stamp/my-form-stamp.module';
import { EmptyPlaceholderModule } from '../empty-placeholder/empty-placeholder.module';

const routes:Routes = [
{
  path: '',
  component:MyFormsComponent
}
];


@NgModule({
  declarations: [MyFormsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MyFormStampModule,
    EmptyPlaceholderModule
  ]
})
export class MyFormsModule { }
