import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTemplatesComponent } from './pages/form-templates/form-templates.component';
import { FormStampModule } from '../form-stamp/form-stamp.module';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AssignNewFormModule } from '../assign-new-form/assign-new-form.module';
import { EmptyPlaceholderModule } from '../empty-placeholder/empty-placeholder.module';


const routes:Routes	= [
	{
		path: '',
		component:FormTemplatesComponent
	}
];
@NgModule({
  declarations: [FormTemplatesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormStampModule,
    NgSelectModule,
    AssignNewFormModule,
    EmptyPlaceholderModule
  ]
})
export class FormTemplatesModule { }
