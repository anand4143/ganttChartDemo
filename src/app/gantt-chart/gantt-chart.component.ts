import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { DataService } from '../service/data.service';

import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
// import { GanttComponent, PdfExportProperties, ToolbarItem } from '@syncfusion/ej2-angular-gantt';
import { editingData } from './demo/demo.component';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import { Gantt } from '@syncfusion/ej2-gantt';
import { GanttComponent, ToolbarItem } from '@syncfusion/ej2-angular-gantt';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { GanttEditorComponent, GanttEditorOptions } from 'ng-gantt';
import { NgxSpinnerService } from 'ngx-spinner';
import { GanttData } from './ganttdata';
declare let require: any;
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// var htmlToPdfmake = require("html-to-pdfmake");
declare let pdfMake: any;
@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GanttChartComponent implements OnInit, AfterViewInit {
  projectRecord: any;
  record = 'Started';
  opened = false;
  status = false;
  show = false;

  // Data for Gantt
  // public data: object[];
  // public taskSettings: object;
  // public toolbar: ToolbarItem[];
  // @ViewChild('gantt', {static: true})
  // public ganttChart: GanttComponent;

  dataEjs = [];
  dataEjsGantt: any;
  taskSettings: any;
  toolbar: ToolbarItem[] = ['PdfExport'];
  @ViewChild('gantt', { static: true })
  ganttObj!: GanttComponent;

  public splitterSettings: object;
  public columns: object[];
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private toaster: ToastrService,
    private datepipe: DatePipe,
    private zone: NgZone
  ) {
    let obj = localStorage.getItem('menuStatus');
    this.dataService.resetHome(false);
    if (obj == 'true') {
      this.status = true;
      this.opened = true;
    } else {
      this.opened = false;
      this.status = false;
    }
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);

    this.route.params.subscribe((params) => {
      this.projectId = params.id;
    });
    if (!this.projectId) {
      this.projectId = localStorage.getItem('projectId');
    }
    this.dataService.getDetail(this.projectId).subscribe((data) => {
      if (data.status == 200) {
        this.projectRecord = data.data;
      }
    });
    this.dataService.setLoading1(true);

    this.dataService.granttChart(this.projectId).subscribe((data) => {
      const tempData = data.data;
      const finalData = [];
      tempData.forEach((element) => {
        element.goal.forEach((ele1) => {
          const goalData = {
            pID: ele1.pID,
            pName: ele1.pName,
            pStart: ele1.pStart,
            pEnd: ele1.pEnd,
            pClass: ele1.pClass,
            pLink: '',
            pMile: 0,
            pRes: 'Brian',
            pComp: 0,
            pGroup: 1,
            pParent: 0,
            pOpen: 1,
            pDepend: '',
            pCaption: '',
            pNotes: 'Some Notes text',
          };
          // const devData = {
          //   TaskID: ele1.id,
          //   TaskName: ele1.pName,
          //   StartDate: new Date(ele1.pStart),
          //   EndDate: new Date(ele1.pEnd),
          // };
          finalData.push(goalData);
          // this.dataEjs.push(devData);
          // console.log(devData);
          const objectivesList = element.objectives.filter((item) => {
            if (ele1.id === item.goalsId) {
              finalData.push(item);
              const strategyList = element.strategy.filter((item1) => {
                if (
                  ele1.id === item1.goalsId &&
                  item1.objectiveId === item.id
                ) {
                  finalData.push(item1);
                  const tatcicList = element.tatcic.filter((tatcicItem) => {
                    if (
                      ele1.id === tatcicItem.goalsId &&
                      tatcicItem.strategyId === item1.id
                    ) {
                      finalData.push(tatcicItem);

                      const activityList = element.activity.filter(
                        (activityItem) => {
                          if (
                            ele1.id === activityItem.goalsId &&
                            activityItem.tacticsId === tatcicItem.id
                          ) {
                            finalData.push(activityItem);
                          }
                        }
                      );
                    }
                  });
                }
              });
            }
          });
        });
        console.log("this.dataEjs inside call===> ", this.dataEjs);
      });
      this.dataDev = finalData;
      console.log("final data=====>",finalData);
      console.log("this.dataDev====>",this.dataDev);

      finalData.forEach( (dt)=>{
      console.log("dt===>",dt);        
      this.dataEjs.push(
        {
          TaskID: dt.id,
          TaskName: dt.pName,
          StartDate: new Date(dt.pStart),
          EndDate: new Date(dt.pEnd),
        }
      )
    })
    

      
      // const devData = {
      //   TaskID: ele1.id,
      //   TaskName: ele1.pName,
      //   StartDate: new Date(ele1.pStart),
      //   EndDate: new Date(ele1.pEnd),
      // };
     
      // this.dataEjs.push(devData);
      
      // this.dataService.setEjsData(this.dataEjs);

      // this.dataInit();
      this.dataService.resetLoading1(false);
      // if(this.dataEjs.length > 0)
        
     
    });


    
  }
  async ngOnInit() {

    this.dataEjsGantt = GanttData;
          this.taskSettings = {
              id: 'TaskID',
              name: 'TaskName',
              startDate: 'StartDate',
              endDate: 'EndDate',
              // progress: 'Progress',
              // child: 'subtasks'
          };
          this.toolbar =  ['ExcelExport','CsvExport','PdfExport'];
    

    //  console.log(" this.this.dataEjs ng on it======>", this.dataEjs);
    //  this.dataEjsGantt = this.dataEjs;
    //       this.taskSettings = {
    //           id: 'TaskID',
    //           name: 'TaskName',
    //           startDate: 'StartDate',
    //           endDate: 'EndDate',
    //           // progress: 'Progress',
    //           // child: 'subtasks'
    //       };
    //       this.toolbar =  ['ExcelExport','CsvExport','PdfExport'];

    //  await this.asyncCall(this.dataEjs);

    
  }

  // resolveAfter2Seconds(data) {
  //   return new Promise(resolve => {
  //     setTimeout(() => {          

  //       this.dataEjsGantt = data;
  //         this.taskSettings = {
  //             id: 'TaskID',
  //             name: 'TaskName',
  //             startDate: 'StartDate',
  //             endDate: 'EndDate',
  //             // progress: 'Progress',
  //             // child: 'subtasks'
  //         };
  //         this.toolbar =  ['ExcelExport','CsvExport','PdfExport'];
    
  //         console.log("GanttData====>",GanttData);
  //         console.log("this.dataEjs====>",this.dataEjs);
  //         console.log("this.dataEjs====>",this.dataEjsGantt);
  //     });
     
  //   });
  // }
  
  //  asyncCall(data) {
  //   console.log('calling=====> ',data);
  //   const result =  this.resolveAfter2Seconds(data);
  //   console.log("result===>",result);
  //   result.then( ()=>{
  //     this.dataEjsGantt = data;
  //     this.taskSettings = {
  //         id: 'TaskID',
  //         name: 'TaskName',
  //         startDate: 'StartDate',
  //         endDate: 'EndDate',
  //         // progress: 'Progress',
  //         // child: 'subtasks'
  //     };
  //     this.toolbar =  ['ExcelExport','CsvExport','PdfExport'];

  //     console.log("GanttData====>",GanttData);
  //     console.log("this.dataEjs====>",this.dataEjs);
  //     console.log("this.dataEjs====>",this.dataEjsGantt);
  //   })
  //   // expected output: "resolved"
  // }


  //  setData(){
  //   console.log("====>",  this.dataService.getEjsData());
  //   this.dataEjs =  GanttData;
  //     this.taskSettings = {
  //         id: 'TaskID',
  //         name: 'TaskName',
  //         startDate: 'StartDate',
  //         endDate: 'EndDate',
  //         // progress: 'Progress',
  //         // child: 'subtasks'
  //     };
  //     this.toolbar =  ['ExcelExport','CsvExport','PdfExport'];

  //     console.log("GanttData====>",GanttData);
  //     console.log("this.dataEjs====>",this.dataEjs);
  // }

  ngAfterViewInit(): void {
    // this.data = GanttData;
    // console.log("====>",  this.data);
    // this.data = this.data;
    //   this.taskSettings = {
    //       id: 'TaskID',
    //       name: 'TaskName',
    //       startDate: 'StartDate',
    //       endDate: 'EndDate',
    //       // progress: 'Progress',
    //       // child: 'subtasks'
    //   };
    //   // this.toolbar =  ['ExcelExport','CsvExport','PdfExport'];
    //   console.log("GanttData====>",GanttData);
    //   console.log("this.data====>",this.data);
  }

  @ViewChild('editor') pdfTable: ElementRef;

  //   public async downloadAsPDF() {
  //   setTimeout(()=>{
  // this.showSpinner = true;
  //   });
  //    /*
  //     var html = htmlToPdfmake(document.getElementById('editor').innerHTML);

  //     const documentDefinition = { content: html };
  //     pdfMake.createPdf(documentDefinition).open(); */
  // //  await this.generatePDF();

  //   }

  //   generatePDF() {
  // console.log(new Date());
  //     const div = document.getElementById('editor');
  //     const options = {
  //       background: 'white',
  //       scale: 3
  //     };

  //     html2canvas(div, options).then((canvas) => {

  //       var img = canvas.toDataURL("image/PNG");
  //       var doc = new jsPDF('l', 'mm', 'a4', true);

  //       // Add image Canvas to PDF
  //       const bufferX = 5;
  //       const bufferY = 5;
  //       const imgProps = (<any>doc).getImageProperties(img);
  //       const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //       doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

  //       return doc;
  //     }).then((doc) => {
  //       doc.save('postres.pdf');

  // console.log(new Date());
  //       this.showSpinner = false;
  //     });
  //   }

  onOpenedChange(e: any) {
    localStorage.setItem('menuStatus', e);
  }

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  projectId: any;
  @ViewChild('editor') editor: GanttEditorComponent;
  // @ViewChild('pdfTable') pdfTable: ElementRef;
  public editorOptions: GanttEditorOptions;
  public dataDev = [];

  vAdditionalHeaders = {
    pStart: {
      title: 'Start Date',
    },
    pEnd: {
      title: 'End Date',
    },
  };
  vUseSingleCell = '0';
  vShowRes = '0';
  vShowCost = '0';
  vShowComp = '0';
  vShowDur = '0';
  vShowStartDate = '0';
  vShowEndDate = '0';
  vShowPlanStartDate = '0';
  vShowPlanEndDate = '0';
  vShowEndWeekDate = '0';
  vShowTaskInfoLink = '0';
  vDebug = 'false';
  vEditable = 'false';
  vUseSort = 'false';
  vLang = 'en';
  delay = 150;

  public onExport() {
    const doc = new jsPDF('p', 'pt', 'a4');
    const source = document.getElementById('editor');
    // doc.text("Test", 40, 20);
    doc.setFontSize(12);
    doc.html(source, {
      callback: function (pdf) {
        doc.output('dataurlnewwindow'); // preview pdf file when exported
      },
    });
    // autotable(doc, {
    //   html: '#content',
    //   useCss: true
    // })
  }

  public toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'ganttDefault_excelexport') {
      this.ganttObj.excelExport();
    } else if (args.item.id === 'ganttDefault_csvexport') {
      this.ganttObj.csvExport();
    } else if (args.item.id === 'ganttDefault_pdfexport') {
      this.ganttObj.pdfExport();
    }
    this.columns = [
      {
        field: 'TaskID',
        headerText: 'Task ID',
        textAlign: 'Left',
        width: '100',
      },
      { field: 'TaskName', headerText: 'Task Name', width: '250' },
      { field: 'StartDate', headerText: 'Start Date', width: '150' },
      { field: 'EndDate', headerText: 'End Date', width: '150' },
      // { field: 'Progress', headerText: 'Progress', width: '150' },
    ];
    this.splitterSettings = {
      columnIndex: 3,
    };
  }

  dataInit() {
    this.editorOptions = {
      vCaptionType: 'Complete', // Set to Show Caption : None,Caption,Resource,Duration,Complete,
      vQuarterColWidth: 300,
      vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
      vDayMajorDateDisplayFormat: 'mon yyyy - Week ww', // Set format to display dates in the "Major" header of the "Day" view
      vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
      vLang: this.vLang,
      vUseSingleCell: this.vUseSingleCell,
      vShowRes: parseInt(this.vShowRes, 10),
      vShowCost: parseInt(this.vShowCost, 10),
      vShowComp: parseInt(this.vShowComp, 10),
      vShowDur: parseInt(this.vShowDur, 10),
      vShowStartDate: parseInt(this.vShowStartDate, 10),
      vShowEndDate: parseInt(this.vShowEndDate, 10),
      vShowPlanStartDate: parseInt(this.vShowPlanStartDate, 10),
      vShowPlanEndDate: parseInt(this.vShowPlanEndDate, 10),
      vShowTaskInfoLink: parseInt(this.vShowTaskInfoLink, 10), // Show link in tool tip (0/1)
      // Show/Hide the date for the last day of the week in header for daily view (1/0)
      vShowEndWeekDate: parseInt(this.vShowEndWeekDate, 10),
      vAdditionalHeaders: this.vAdditionalHeaders,
      vEvents: {
        taskname: console.log,
        res: console.log,
        dur: console.log,
        comp: console.log,
        start: console.log,
        end: console.log,
        planstart: console.log,
        planend: console.log,
        cost: console.log,
      },

      vResources: [
        { id: 0, name: 'Anybody' },
        { id: 1, name: 'Mario' },
        { id: 2, name: 'Henrique' },
        { id: 3, name: 'Pedro' },
      ],
      vEventClickRow: console.log,
      vTooltipDelay: this.delay,
      vDebug: this.vDebug === 'true',
      vEditable: this.vEditable === 'true',
      vUseSort: this.vUseSort === 'true',
      vFormatArr: ['Day', 'Week', 'Month', 'Quarter'],
      vFormat: 'week',
    };
    this.editor.setOptions(this.editorOptions);
  }

  showSpinner = false;
  anand: any;

  downloadImage() {
    var doc = new jsPDF();
    var ele = document.getElementById('editor');
    // console.log(ele);
    // html2canvas(ele).then(canvas => {
    //   // this.saveAs(canvas.toDataURL("image/png"), `canvas.png`)
    //    var base64image = canvas.toDataURL("image/png",0.5);

    // // Split the base64 string in data and contentType
    // var block = base64image.split(",");
    // // console.log(block[1]);

    // // this.saveAs(base64image,"dev.png");

    // var link = document.createElement('a');
    // link.href = base64image;
    //       link.download = "dev.png";

    //       //Firefox requires the link to be in the body
    //       document.body.appendChild(link);

    //       //simulate click
    //       link.click();
    // });
  }

  //  downloadImageDEV() {
  //   // const doc = new jsPDF();

  //   this.cdr.detectChanges();
  //   const content = document.getElementById('printchart')
  //   const options = {content,
  //     filename: 'grantt' + Date.now()+".pdf",
  //     image: { type: 'jpeg'},
  //     html2canvas: { dpi: 96, letterRendering: true },
  //     jsPDF: { orientation: 'landscape'}
  //   };

  //   // html2pdf().from(content).set(options).save();
  // }

  initialData() {
    return [
      {
        pID: 'g1',
        pName: 'Goal1',
        pStart: '2017-02-20',
        pEnd: '2017-03-16',
        pClass: 'ggroupblack',
        pLink: '',
        pMile: 0,
        pRes: 'Brian',
        pComp: 0,
        pGroup: 1,
        pParent: 0,
        pOpen: 1,
        pDepend: '',
        pCaption: '',
        pNotes: 'Some Notes text',
      },
      {
        pID: 'o1',
        pName: 'Objective1',
        pStart: '2017-02-20',
        pEnd: '2017-02-25',
        pClass: 'ggroupblack',
        pLink: '',
        pMile: 0,
        pRes: 'Brian',
        pComp: 50,
        pGroup: 0,
        pParent: 'g1',
        pOpen: 1,
        pDepend: '',
        pCaption: '',
        pNotes: '',
      },
      {
        pID: 's1',
        pName: 'Strategy1',
        pStart: '2017-02-20',
        pEnd: '2017-02-29',
        pClass: 'ggroupblack',
        pLink: '',
        pMile: 0,
        pRes: 'Brian',
        pComp: 30,
        pGroup: 0,
        pParent: 'o1',
        pOpen: 1,
        pDepend: 'o1',
        pCaption: '',
        pNotes: '',
      },
      {
        pID: 12,
        pName: 'Objective2',
        pStart: '2017-02-20',
        pEnd: '2017-02-25',
        pClass: 'ggroupblack',
        pLink: '',
        pMile: 0,
        pRes: 'Brain',
        pComp: 100,
        pGroup: 0,
        pParent: 1,
        pOpen: 1,
        pDepend: '',
        pCaption: '',
        pNotes: '',
      },
    ];
  }
  // filter(): void {
  //   this.ganttObj.filterByColumn('TaskName','startswith','Iden','and');
  //   };
}
