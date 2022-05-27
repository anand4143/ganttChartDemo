import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';
import { MatAccordion } from '@angular/material/expansion';
import {
  GridComponent, ToolbarService, ExcelExportService, PdfExportService,
  GroupService, ExcelQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs
} from '@syncfusion/ej2-angular-grids';
import { TreeNode } from 'src/data';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-track-monitor',
  templateUrl: './track-monitor.component.html',
  styleUrls: ['./track-monitor.component.scss']
})
export class TrackMonitorComponent implements OnInit {
  public pageSettings: Object;
  public isInitial: Boolean = true;
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: any;
  projectRecord = [];
  errMessage: any;
  status = false;
  opened = false;
  permissions: any;
  moniterPermission: any;
  panelOpenState = false;
  html = false;
  accordionList: any;
  public data: Object[];
  public toolbar: string[];
  nodes: TreeNode[] = [];
  workStreamId: any;
  constructor(private dataService: DataService, private toaster: ToastrService,private titleService:Title,
    private spiner: NgxSpinnerService, private router: Router) {
    this.projectLists();
    let obj = localStorage.getItem('menuStatus');
    if (obj == 'true') {
      this.status = true;
      this.opened = true;
    }
    else {
      this.opened = false;
      this.status = false;
    }
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);
    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'track-monitor') {
            this.moniterPermission = element
            if (this.moniterPermission.view == true) {
              this.html = true;
            }
            else {
              // this.toaster.error("you don't have permission to access this resource");
            }
          }
        });
      }
      if (results.status == 404) {
        this.moniterPermission = results.data;
        if (this.moniterPermission.view == false) {
          this.html = false
          this.toaster.error("you don't have permission to access this resource");
        }
      }
    })
    this.dataService.resetHome(false);
  }

  ngOnInit(): void {
    this.toolbar = ['ExcelExport'];
  }

  projectLists() {
    this.dataService.setLoading3(true);
    this.dataService.regionWiseProjectList().subscribe(data => {
      if (data.status == 200) {
        this.projectRecord = data.data;
        this.projectRecord.forEach((node: any) => {
          node.isExpanded = true;
          node.project.forEach(element => {
            element.isExpanded = true;
            element.projectName = element.projectName
          });
        })
        this.dataService.resetLoading3(false);
      }
      if (data.status == 404) {
        this.dataService.resetLoading3(false);
        this.errMessage = "No Record Found";
      }
      if (data.status == 500) {
        this.errMessage = "Unable To Process";
        this.toaster.error('Unable To Process');
      }

    })
  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }
  getRecord(e: any) {
    this.dataSource = new MatTableDataSource(e.project);
  }
  ViewDetail(element) {
    this.router.navigateByUrl('/product-detail/' + element.id);
    localStorage.setItem('projectId', element.id);
  }

  exportAsXLSX(id: any): void {
    this.dataService.getTaskList(id, this.workStreamId).subscribe(data => {
      if (data.status == 200) {
        this.nodes = data.data;
        this.data = this.nodes;
        setTimeout(() => {
          this.toolbarClick('Excel Export');
        }, 2000);
      }
      if (data.status == 404) {
        this.nodes = [];
        // this.toaster.error('No Record Found');
      }
      if (data.status == 500) {
        this.toaster.error(' Unable To Process, please try again later');
      }
    })

  }
  grandChart(element) {
    this.router.navigateByUrl('/gantt-chart/' + element.id);
    localStorage.setItem('projectId', element.id);
  }

  expandNode(item: any) {
    this.projectRecord.forEach((node: any) => {
      node.isExpanded = true;
    })

  }
  toolbarClick(args: any): void {
    switch (args) {
      case 'PDF Export':
        this.grid.pdfExport();
        break;
      case 'Excel Export':
        this.grid.excelExport();
        break;
      case 'CSV Export':
        this.grid.csvExport();
        break;
    }
  }

  populationValue(field: string, data: Object): number {
    return data[field] / 1000000;
  }
  exportQueryCellInfo(args: ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs): void {
    if (args.column.headerText === 'Employee Image') {

    }
    if (args.column.headerText === 'Email ID') {

    }
  }
}