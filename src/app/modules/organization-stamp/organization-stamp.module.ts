import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationStampComponent } from './pages/organization-stamp/organization-stamp.component';

import { RouterModule, Routes } from '@angular/router';
const routes:Routes = [];

@NgModule({
  declarations: [OrganizationStampComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],exports: [
  	OrganizationStampComponent
  ]
})
export class OrganizationStampModule { }
