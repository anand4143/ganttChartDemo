import { Component, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-demo-charts',
  // template:
  // `<ejs-gantt id="ganttDefault" height="430px" [dataSource]="data" [taskFields]="taskSettings"  [editSettings]="editSettings" [columns]="columns" [toolbar]="toolbar"></ejs-gantt>`,
  encapsulation: ViewEncapsulation.None
})
export class DemoChartsComponent implements OnInit {


  public ngOnInit(): void {
  }

}
