import { NgModule } from '@angular/core';

import { PaginationComponent } from './pagination.component';
import { ShareModule } from 'src/app/share.module';

@NgModule({
  declarations: [PaginationComponent],
  imports: [
    ShareModule
  ],
  exports: [PaginationComponent]
})
export class PaginationModule { }
