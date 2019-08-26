import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from 'src/app/http/http.service';
import { map } from 'rxjs/operators';

export enum SearchType {
  input = 0, select = 1, doubleSelect = 2, datePicker = 3, doubleInput = 4, singleDate = 5, monthPicker = 6,
  radio = 7, selectCheck = 8, checkbox = 9
}

/**
 * @param show:是否展示,默认为true
 * @param type:选择表单控件 input,select,double-select,double-input,select-check
 * @param label：展示的label名称
 *
*/
export class SearchItem {

  type: SearchType;
  label?: string;
  constructor(label: string, type: SearchType) {
    this.label = label;
    this.type = type;
  }
}
/**
 * @param name:传给后台的name
 * @param dataSource:select的数据源
 * @param code:selecet或者checkbox的值
 *
*/
export class ChildSelectItem {
  name: string;
  dataSource?: Observable<any[]> | any;
  code?: any;
  search?: boolean;
  params?: string;
  label?: string; // 二级需要选择
  valueKey: string;
  optionCode?: string;
  optionLabel?: string;
  list?: any[];
  searchAll?: boolean;
}
export class DatePickerItem {
  name: string;
  date: any;
}
export class DoubleInputItem {
  name: string;
  valueKey?: any;
}

interface InitList {
  name: string;
  code: string;
}

export class SelectCheckItem {
  label: string;
  name: string;
  valueKey?: string;
  code?: boolean;
  dataSource?: Observable<any[]>;
  optionCode?: string;
  optionLabel?: string;
}

export class SearchItemWithDatasource extends SearchItem {
  // 数据源
  dataSource?: Observable<any[]>;
  initList?: InitList[];
  search?: true; // 是否显示搜索
  show?: boolean;
  hidden?: boolean; // 隐藏
  width?: string;
  nameKey?: string;
  valueKey?: any;
  default_value?: string;
  optionCode?: string;
  optionLabel?: string;
  date?: any; // 时间选择器显示
  datePicker?: DatePickerItem[];
  doubleInput?: DoubleInputItem[];
  doubleSelectList?: ChildSelectItem[];
  selectCheckList?: SelectCheckItem[];
}




@Component({
  selector: 'app-searchbar',
  templateUrl: './app-searchbar.component.html',
  styleUrls: ['./app-searchbar.component.less']
})
export class AppSearchbarComponent implements OnInit, AfterViewInit {
  @Input() queryList: SearchItemWithDatasource[];
  @Input() startSearch = 'true';
  @Output() childemit: EventEmitter<any> = new EventEmitter<any>();
  @Input() hidesearch = true;   // 进行当前状态记录
  @Input() modifyQuerylist = false;
  // @Output() queryListTest = new Subject<any>();
  searchObj = {};
  public closeText = '展开';
  public inittogglesearch = true;      // 判断是否有显示更多的按钮
  public initQueryList = {}; // 进行初始数据记录
  public changeInitDefault = true;
  constructor() { }
  ngAfterViewInit() {
    if (this.startSearch === 'true') {
      console.log("第一次查询");
      this.search();
    }
  }
  ngOnInit() {
    this.initFn();


  }

  ngOnChanges(): void {
    if (this.modifyQuerylist) {
      this.initFn().search();
    }
  }

  initFn() {
    this.inittogglesearch = this.queryList.some(item => item['show'] === false);
    this.queryList.map((item) => {
      item.show = item.show === false ? false : true;
      item.valueKey = item.valueKey ? item.valueKey : "";
      item.optionCode = item.optionCode ? item.optionCode : "code";
      item.optionLabel = item.optionLabel ? item.optionLabel : "name";

      if (item.type === 3) {
        // 时间选择器的时候进行数据的转换
        item.date = [item.datePicker[0].date, item.datePicker[1].date];
      }

      if (item.initList) {
        if (item.initList[0] && item.initList[0].code !== "") {
          item.initList.unshift({ name: "全部", code: '' })
        }
      }

      if (item.dataSource) {
        item.dataSource = item.dataSource.pipe(map(data => {
          let returnList = [];
          if (data['data'] && data['data']['rows']) {
            returnList = data['data']['rows'];
          } else {
            returnList = data['data'];
          }
          let obj = {};
          if (returnList && returnList[0][item['optionCode']] !== '') {
            obj[item['optionLabel']] = "全部";
            obj[item['optionCode']] = "";
            returnList.unshift(obj);
          }
          return returnList;
        }));
        console.log(this.queryList);
      }
    });
    this.initQueryList = this.cloneList();
    return this;
  }

  search() {

    let emitObj = {};
    this.queryList.forEach((item) => {
      switch (item.type) {
        case SearchType.input:
          emitObj[item.nameKey] = item.valueKey;
          break;
        case SearchType.select:
          emitObj[item.nameKey] = item.valueKey;
          break;
        case SearchType.doubleSelect:
          emitObj[item.doubleSelectList[0].name] = item.doubleSelectList[0].valueKey;
          emitObj[item.doubleSelectList[1].name] = item.doubleSelectList[1].valueKey;
          break;
        case SearchType.selectCheck:
          emitObj[item.selectCheckList[0].name] = item.selectCheckList[0].valueKey;
          emitObj[item.selectCheckList[1].name] = item.selectCheckList[1].valueKey;
          break;
        case SearchType.doubleInput:
          emitObj[item.doubleInput[0].name] = item.doubleInput[0].valueKey;
          emitObj[item.doubleInput[1].name] = item.doubleInput[1].valueKey;
          break;
        case SearchType.singleDate:
          console.log(item.valueKey);
          let time = new Date(item.valueKey);
          // let month = `${time.getMonth() + 1}`.padStart(2, '0');
          // let date = `${time.getDate()}`.padStart(2, '0');
          let month = (time.getMonth() + 1) < 10 ? '0' + time.getMonth() : time.getMonth();
          let date = (time.getDate()) < 10 ? '0' + time.getDate() : time.getDate();
          emitObj[item.nameKey] = `${time.getFullYear()}-${month}-${date}`;
          break;
        case SearchType.monthPicker:
          if (item.valueKey) {
            let monthPicker = (item.valueKey.getMonth() + 1) < 10 ? '0' + (item.valueKey.getMonth() + 1) : item.valueKey.getMonth() + 1;
            emitObj[item.nameKey] = `${item.valueKey.getFullYear()}-${monthPicker}`;
          }
          break;
        case SearchType.datePicker:
          if (item['date']) {
            let starTime = new Date(item['date'][0]);
            let endTime = new Date(item['date'][1]);
            let startMonth = (starTime.getMonth() + 1) < 10 ? '0' + (starTime.getMonth() + 1) : (starTime.getMonth() + 1);
            let endMonth = (endTime.getMonth() + 1) < 10 ? '0' + (endTime.getMonth() + 1) : (endTime.getMonth() + 1);
            let startDate = (starTime.getDate()) < 10 ? '0' + (starTime.getDate()) : (starTime.getDate());
            let endDate = endTime.getDate() < 10 ? '0' + endTime.getDate() : endTime.getDate();

            // let startMonth = `${starTime.getMonth() + 1}`.padStart(2, '0');
            // let endMonth = `${endTime.getMonth() + 1}`.padStart(2, '0');
            // let startDate = `${starTime.getDate()}`.padStart(2, '0');
            // let endDate = `${endTime.getDate()}`.padStart(2, '0');
            emitObj[item.datePicker[0].name] = `${starTime.getFullYear()}-${startMonth}-${startDate} 00:00:00`;
            emitObj[item.datePicker[1].name] = `${endTime.getFullYear()}-${endMonth}-${endDate} 23:59:59`;
          }
          break;
        case SearchType.radio:
          emitObj[item.nameKey] = item.valueKey;
          break;
        case SearchType.checkbox:
          emitObj[item.nameKey] = item.valueKey;
          break;
      }
    });
    console.log(emitObj);
    this.childemit.emit(emitObj);
  }
  // 展开更多按钮
  togglesearch() {
    console.log(this.initQueryList);
    this.hidesearch = !this.hidesearch;
    this.closeText = this.hidesearch ? '展开' : '关闭';
    this.queryList = this.queryList.map((item, index) => {
      if (index >= 3) {
        item.show = this.hidesearch ? false : true;
      }
      return item;
    });
    console.log(this.queryList);

  }
  // 只重置数据，不重置状态(关闭/打开)
  reset() {
    this.queryList.forEach((item) => {
      switch (item.type) {
        case SearchType.input:
          item.valueKey = this.initQueryList[item.nameKey];
          break;
        case SearchType.select:
          item.valueKey = this.initQueryList[item.nameKey];
          break;
        case SearchType.doubleSelect:
          item.doubleSelectList[0].valueKey = this.initQueryList[item.doubleSelectList[0].name];
          item.doubleSelectList[1].valueKey = this.initQueryList[item.doubleSelectList[1].name];
          break;
        case SearchType.selectCheck:
          item.selectCheckList[0].valueKey = this.initQueryList[item.selectCheckList[0].name];
          item.selectCheckList[1].code = this.initQueryList[item.selectCheckList[1].name];
          break;
        case SearchType.doubleInput:
          item.doubleInput[0].valueKey = this.initQueryList[item.doubleInput[0].name];
          item.doubleInput[1].valueKey = this.initQueryList[item.doubleInput[0].name];
          break;
        case SearchType.singleDate:
          item.valueKey = this.initQueryList[item.nameKey];
          break;
        case SearchType.monthPicker:
          item.valueKey = this.initQueryList[item.nameKey];
          break;
        case SearchType.datePicker:
          item.datePicker[0].date = this.initQueryList[item.datePicker[0].name];
          item.datePicker[1].date = this.initQueryList[item.datePicker[1].name];
          break;
        case SearchType.radio:
          item.valueKey = this.initQueryList[item.nameKey];
          break;
        case SearchType.checkbox:
          item.valueKey = this.initQueryList[item.nameKey];
          break;
      }
    });
    console.log(this.initQueryList);

  }


  cloneList(): Object {
    let initList = {};
    this.queryList.forEach((item) => {
      switch (item.type) {
        case SearchType.input:
          initList[item.nameKey] = item.valueKey;
          break;
        case SearchType.select:
          initList[item.nameKey] = item.valueKey;
          break;
        case SearchType.doubleSelect:
          initList[item.doubleSelectList[0].name] = item.doubleSelectList[0].valueKey;
          initList[item.doubleSelectList[1].name] = item.doubleSelectList[1].valueKey;
          break;
        case SearchType.selectCheck:
          initList[item.selectCheckList[0].name] = item.selectCheckList[0].valueKey;
          initList[item.selectCheckList[1].name] = item.selectCheckList[1].code;
          break;
        case SearchType.doubleInput:
          initList[item.doubleInput[0].name] = item.doubleInput[0].valueKey;
          initList[item.doubleInput[1].name] = item.doubleInput[1].valueKey;
          break;
        case SearchType.singleDate:
          initList[item.nameKey] = item.valueKey;
          break;
        case SearchType.monthPicker:
          initList[item.nameKey] = item.valueKey;
          break;
        case SearchType.datePicker:
          initList[item.datePicker[0].name] = item.datePicker[0].date;
          initList[item.datePicker[1].name] = item.datePicker[1].date;
          break;
        case SearchType.radio:
          initList[item.nameKey] = item.valueKey;
          break;
        case SearchType.checkbox:
          initList[item.nameKey] = item.valueKey;
          break;
      }
    });
    return initList;
  }

  // 搜索二级线上品类
  getSubOnlineCategories(event, option) {
    let obj = {};
    obj[option.doubleSelectList[1].params] = event;
    this.queryList.forEach(item => {
      if (item.label === option.label) {
        option.doubleSelectList[1].dataSource.request(obj)
          .pipe(map(data => data['data']))
          .subscribe(res => {
            if (item.doubleSelectList[1].searchAll === false) {
              item.doubleSelectList[1].valueKey = res[0][item.doubleSelectList[1].optionCode];
              item.doubleSelectList[1].list = res;
            } else {
              item.doubleSelectList[1].valueKey = "";
              let allSearch = {};
              allSearch[item['doubleSelectList'][1].optionCode] = "";
              allSearch[item['doubleSelectList'][1].optionLabel] = "全部";
              item.doubleSelectList[1].list = [...[allSearch], ...res];
            }
          });
      }
    });
  }

  changeInitValue(option, list) {
    if (option.default_value === 'first') {
      option.valueKey = list[1][option.optionCode];
      this.changeInitDefault = false;
      this.search();
    }
  }

}

