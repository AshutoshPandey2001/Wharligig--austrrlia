import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyPlaceholderComponent } from './empty-placeholder/empty-placeholder.component';



@NgModule({
  declarations: [EmptyPlaceholderComponent],
  imports: [
    CommonModule
  ],
  exports: [EmptyPlaceholderComponent]
})
export class EmptyPlaceholderModule { }
