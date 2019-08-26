import { Component, OnInit, ContentChild, TemplateRef, Input, AfterContentInit, AfterViewInit } from '@angular/core';
import { API, ParamsBody } from 'src/app/models';
import { Constants } from 'src/app/constants/constants';
import { Observable, Subject } from 'rxjs';
interface TableCollumnObj {
  code: string;
  name: string;
  index: number;
  show: boolean;
  sort: boolean;
  width: number;
  style: any;
  notice: string;
  template: TemplateRef<any>;
  transform: (col: any, row: any) => string;
}

interface TableHeaderObj {
  name: string;
  width?: number;
  rowspan?: number;
  colspan?: number;
}



interface TableCfgObj {
  checkbox: boolean;
  allchecked: boolean;
  indeterminate: boolean;
  checkedallchange: (value: any) => void;
  // 是否选中key
  checkedkey: string;
  // 是否禁用key
  checkdisabledkey: string;
  checkedchange: () => void;
}
export type TableCfg = Partial<TableCfgObj>;
export type TableCollumn = Partial<TableCollumnObj>;
export type TableHeader = TableHeaderObj;


@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.less']
})
export class AppTableComponent implements OnInit, AfterViewInit {
  // @ContentChild(TemplateRef) name: TemplateRef<any>;
  // data = { name: 1 };
  @Input() source: API;
  @Input() params: ParamsBody;
  @Input() collumns: TableCollumn[];
  @Input() showCheckBox: boolean;              // 是否显示勾选的功能
  @Input() showRowNo: boolean;                 // 是否展示表单第一列的num
  @Input() tableHeader: TableHeaderObj[][];    // 是否是多重表头，需要自己定义
  @Input() showPagination = true;              // 是否展示分页栏
  @Input() modifyCollumns = false; // 是否启动 ngOnChanges 里面的函数
  @Input() tabelData: Subject<TableCollumn[]>; // 外部进行数据的修改
  public widthConfig: number[] = [];
  _datas: any[];
  _allchecked = false;
  _indeterminate = false;
  _loading = false;
  pagesizeoptions = Constants.PageSizeOptions;
  timeout: NodeJS.Timer;
  constructor() { }

  ngOnInit() {
    if (this.tabelData) {
      this.tabelData.subscribe((data) => {
        if (this._datas === undefined || this._datas.length === 0) {
          this._datas = [...[], ...data];
        } else {
          this._datas = [...this._datas, ...data];
        }
      })
    }

    if (this.collumns[0].index) {
      this.collumns = this.collumns.sort((a, b) => a.index - b.index);
    }
    if (this.tableHeader) {
      this.widthConfig = this.tableHeader[0].map(item => item.width);
    }
    this.collumns.forEach(item => item.show = item.show === false ? false : true);
  }

  ngOnChanges(): void {
    if (this.modifyCollumns) {
      if (this.collumns[0].index) {
        this.collumns = this.collumns.sort((a, b) => a.index - b.index);
      }
      if (this.tableHeader) {
        this.widthConfig = this.tableHeader[0].map(item => item.width);
      }
      this.collumns.forEach(item => item.show = item.show == false ? false : true);
      if (JSON.stringify(this.params.search) !== '{}') {
        this._search();
      }

    }
  }
  ngAfterViewInit() { }
  getChecked() {
    return this._datas.filter(v => v._checked);
  }
  _search(p?: ParamsBody) {
    console.log(this.source);
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.search(p);
      }, 50);
    }

  }
  search(p?: ParamsBody) {
    console.log(this.source);
    if (p) {
      this.params['search'] = p;
    }
    this._loading = true;
    this.source.request<any>(this.params).subscribe(v => {
      if (v['data'] instanceof Array) {
        this._datas = v.data;
      } else {
        this._datas = v.data.rows;
      }

      this._loading = false;
      this.params.count = v.data.count;
      this.params.rowno = this.params.count === 0 ? 0 : (this.params.page_no - 1) * this.params.page_size;
      delete this.timeout;
    });

  }
  _checkStatusChange() {
    let m = false;
    let a = true;
    this._datas.forEach(d => {
      if (d._checked) {
        m = true;
      } else {
        a = false;
      }
    });
    if (a) {
      m = false;
    }
    this._allchecked = a;
    this._indeterminate = m;
  }
  _checkall() {
    this._datas.map(v => v._checked = this._allchecked);
    this._allchecked ? this._indeterminate = false : false;
  }
  _sort(sort: { key: string, value: string }) {
    if (sort && sort.key.length > 0) {
      this.params.sort = sort.key;
      this.params.sortDirKey = sort.value === 'descend' ? 'DESC' : 'ASC';
      this._search();
    }
  }


}
