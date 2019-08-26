import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTableComponent } from './app-table.component';
import { ShareModule } from 'src/app/share.module';
import { HtmlPipe } from 'src/app/pipes/html.pipe';
import { MyhtmlDirective } from 'src/app/directives/myhtml.directive';
import { PaginationModule } from '../pagination/pagination.module';

@NgModule({
  declarations: [AppTableComponent, HtmlPipe, MyhtmlDirective],
  imports: [
    ShareModule
  ], exports: [
    AppTableComponent,
    PaginationModule
  ]
})
export class AppTableModule { }
