import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SopListComponent } from './sop-list/sop-list.component';
import { RouterModule, Routes } from '@angular/router';
import { EmptyPlaceholderModule } from '../empty-placeholder/empty-placeholder.module';

const routes:Routes = [
  {
    path: '',
    component: SopListComponent
  }
];

@NgModule({
  declarations: [SopListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EmptyPlaceholderModule
  ]
})
export class SopListModule { }
