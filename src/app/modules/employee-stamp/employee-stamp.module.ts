import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeStampComponent } from './employee-stamp/employee-stamp.component';

import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [];

@NgModule({
  declarations: [EmployeeStampComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],exports: [
    EmployeeStampComponent
  ]
})
export class EmployeeStampModule { }
