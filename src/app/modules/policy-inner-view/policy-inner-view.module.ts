import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyInnerViewComponent } from './policy-inner-view/policy-inner-view.component';

import { RouterModule, Routes } from '@angular/router';
import { AssignNewFormModule } from '../assign-new-form/assign-new-form.module';

const routes:Routes = [
  {
    path: '',
    component:PolicyInnerViewComponent
  }
];

@NgModule({
  declarations: [PolicyInnerViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AssignNewFormModule
  ]
})
export class PolicyInnerViewModule { }
