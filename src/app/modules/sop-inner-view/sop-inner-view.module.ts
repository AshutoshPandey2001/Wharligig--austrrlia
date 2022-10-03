import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SopInnerViewComponent } from './sop-inner-view/sop-inner-view.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path: '',
    component: SopInnerViewComponent
  }
];

@NgModule({
  declarations: [SopInnerViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SopInnerViewModule { }
