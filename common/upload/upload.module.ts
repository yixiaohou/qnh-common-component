import { NgModule } from '@angular/core';
import { UploadComponent } from './upload.component';
import { ShareModule } from 'src/app/share.module';

@NgModule({
  imports: [
    ShareModule,
  ],
  declarations: [UploadComponent],
  exports: [
    UploadComponent,
  ]
})
export class UploadModule { }
