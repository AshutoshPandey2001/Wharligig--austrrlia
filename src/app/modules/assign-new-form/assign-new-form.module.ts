import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignNewFormComponent } from './assign-new-form/assign-new-form.component';
import { FormStampModule } from '../form-stamp/form-stamp.module';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgDatepickerModule } from 'ng2-datepicker';

@NgModule({
  declarations: [AssignNewFormComponent],
  imports: [
    CommonModule,
    FormStampModule,
    NgSelectModule,
    NgDatepickerModule
  ],
  exports: [AssignNewFormComponent]
})
export class AssignNewFormModule { }
