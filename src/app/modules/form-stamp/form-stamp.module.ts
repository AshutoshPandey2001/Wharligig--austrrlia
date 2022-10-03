import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStampComponent } from './pages/form-stamp/form-stamp.component';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [FormStampComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule

  ],
  exports: [FormStampComponent]
})
export class FormStampModule { }
