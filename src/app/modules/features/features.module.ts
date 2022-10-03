import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { FeaturesPageComponent } from './pages/features-page/features-page.component';

const routes: Routes = [
  { path: '',
    component: FeaturesPageComponent
  }
];

@NgModule({
  declarations: [FeaturesPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class FeaturesModule { }
