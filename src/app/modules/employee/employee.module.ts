import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee/employee.component';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeStampModule } from '../employee-stamp/employee-stamp.module';
import { AddNewUserModule } from '../add-new-user/add-new-user.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmptyPlaceholderModule } from '../empty-placeholder/empty-placeholder.module';

const routes:Routes = [
  {
    path: '',
    component: EmployeeComponent
  }
] 

@NgModule({
  declarations: [EmployeeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EmployeeStampModule,
    FormsModule,
    NgSelectModule,
    AddNewUserModule,
    EmptyPlaceholderModule
  ]
})
export class EmployeeModule { }
