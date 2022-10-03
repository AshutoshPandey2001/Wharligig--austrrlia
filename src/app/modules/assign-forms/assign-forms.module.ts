import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignFormsComponent } from './assign-forms/assign-forms.component';
import { RouterModule, Routes } from '@angular/router';
import { AssignedFormStampModule } from '../assigned-form-stamp/assigned-form-stamp.module';
import { EmptyPlaceholderModule } from '../empty-placeholder/empty-placeholder.module';

const routes:Routes = [
{
  path: '',
  component:AssignFormsComponent
}
];


@NgModule({
  declarations: [AssignFormsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AssignedFormStampModule,
    EmptyPlaceholderModule
  ]
})
export class AssignFormsModule { }
