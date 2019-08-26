import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share.module';
import { AppSearchbarComponent } from './app-searchbar.component';

@NgModule({
  declarations: [AppSearchbarComponent],
  imports: [
    ShareModule
  ],
  exports: [
    AppSearchbarComponent
  ]
})
export class AppSearchbarModule { }
