import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuillEditorModule } from 'ngx-quill-editor';
import { UploaderComponent } from './pages/uploader/uploader.component';
import { NgSelectModule } from '@ng-select/ng-select';

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
    QuillEditorModule,
    NgSelectModule
  ]
})
export class UploaderModule { }
