
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationsComponent } from './pages/organizations/organizations.component';
import { OrganizationStampModule } from '../organization-stamp/organization-stamp.module';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../material-module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmptyPlaceholderModule } from '../empty-placeholder/empty-placeholder.module';

const routes:Routes = [
	{
		path: '',
		component:OrganizationsComponent
	}
] 
@NgModule({
  declarations: [OrganizationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    OrganizationStampModule,
    MaterialModule,
    FormsModule,
    NgSelectModule,
    EmptyPlaceholderModule
  ]
})
export class OrganizationsModule { }
