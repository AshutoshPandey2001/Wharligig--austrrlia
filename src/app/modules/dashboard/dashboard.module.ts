import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SubmittedFormStampModule } from '../submitted-form-stamp/submitted-form-stamp.module';
import { ChapterStampModule } from '../chapter-stamp/chapter-stamp.module';
import { FormStampModule } from '../form-stamp/form-stamp.module';
import { MyFormStampModule } from '../my-form-stamp/my-form-stamp.module';
import { AssignedFormStampModule } from '../assigned-form-stamp/assigned-form-stamp.module';
import { OrganizationStampModule } from '../organization-stamp/organization-stamp.module';
import { EmployeeStampModule } from '../employee-stamp/employee-stamp.module';
import { AddNewUserModule } from '../add-new-user/add-new-user.module';
import { AssignNewFormModule } from '../assign-new-form/assign-new-form.module';
import { EmptyPlaceholderModule } from '../empty-placeholder/empty-placeholder.module';

const routes: Routes = [
  { path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SubmittedFormStampModule,
    ChapterStampModule,
    FormStampModule,
    OrganizationStampModule,
    EmployeeStampModule,
    MyFormStampModule,
    AssignedFormStampModule,
    AddNewUserModule,
    AssignNewFormModule,
    EmptyPlaceholderModule
  ]
})
export class DashboardModule { }
