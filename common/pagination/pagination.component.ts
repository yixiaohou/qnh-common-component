import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PageParams } from 'src/app/models';



// export class PageContent {
//   pagesize: number;
//   count: number;
//   pageindex: number;
//   firstrow: number;
//   constructor(size: number = Constants.PageSize, count: number = 0, index: number = 1) {
//     this.pagesize = size;
//     this.count = count;
//     this.pageindex = index;
//     this.firstrow = this.count === 0 ? 0 : (this.pageindex - 1) * this.pagesize;
//   }
// }


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less']
})
export class PaginationComponent implements OnInit {
  @Input()
  content: PageParams;
  @Output()
  changed = new Subject<PageParams>();
  @Input()
  pagesizeoptions = Constants.PageSizeOptions;
  private timeout: NodeJS.Timer;
  constructor() { }

  ngOnInit() {
  }
  change() {
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this._change();
      }, 50);
    }
  }
  private _change() {
    this.content.rowno = this.content.count === 0 ? 0 : (this.content.page_no - 1) * this.content.page_size;
    this.changed.next(this.content);
    delete this.timeout;
  }
}
