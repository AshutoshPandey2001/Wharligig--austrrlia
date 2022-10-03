import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SopUploaderComponent } from './sop-uploader/sop-uploader.component';
import { RouterModule, Routes } from '@angular/router';
import { QuillEditorModule } from 'ngx-quill-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

const routes:Routes = [
  {
    path: '',
    component: SopUploaderComponent
  }
];

@NgModule({
  declarations: [SopUploaderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    QuillEditorModule,
    NgSelectModule,
    FormsModule
  ]
})
export class SopUploaderModule { }
