import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { UploaderComponent } from './pages/uploader/uploader.component';

const routes: Routes = [
  { path: '',
    component: UploaderComponent
  }
];

@NgModule({
  declarations: [UploaderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgSelectModule
  ]
})
export class UploaderModule { }
