import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { RouterModule, Routes } from '@angular/router';


const routes:Routes = [
  {
    path: '',
    component:NotificationComponent
  }
] 

@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class NotificationModule { }
