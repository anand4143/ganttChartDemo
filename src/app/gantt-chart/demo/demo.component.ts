import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GanttEditorComponent, GanttEditorOptions } from 'ng-gantt';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/service/data.service';
import html2canvas from 'html2canvas';
// declare let html2canvas: any;
import { jsPDF } from "jspdf";

// import * as htmlToImage from 'html-to-image';
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
// import * as download from "downloadjs";
// import jsPDF from 'jspdf';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// import htmlToPdfmake from 'html-to-pdfmake';
import * as html2pdf from 'html2pdf.js'

import { GanttComponent, ToolbarItem, SelectionSettingsModel, PdfExportProperties } from '@syncfusion/ej2-angular-gantt';
import { ClickEventArgs } from '@syncfusion/ej2-navigations/src/toolbar/toolbar';


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DemoComponent implements OnInit, AfterViewInit {
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  projectId: any;
  @ViewChild("editor") editor: GanttEditorComponent;
  // @ViewChild('pdfTable') pdfTable: ElementRef;
  public editorOptions: GanttEditorOptions;
  public dataDev = [];
  record: any;
  vAdditionalHeaders = {
    pStart: {
      title: 'Start Date'
    },
    pEnd: {
      title: 'End Date'
    }
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
  projectRecord: any;

  // Data for Gantt
  public data: object[];
  public taskSettings: object;
  public toolbar: ToolbarItem[];
  @ViewChild('gantt', {static: true})
  public ganttChart: GanttComponent;


  constructor(private dataService: DataService, private route: ActivatedRoute, private spiner: NgxSpinnerService,private cdr: ChangeDetectorRef) {
    this.route.params.subscribe(params => {
      this.projectId = params.id;
    });
    if (!this.projectId) {
      this.projectId = localStorage.getItem('projectId');
    }
    this.dataService.getDetail(this.projectId).subscribe(data => {
      if (data.status == 200) {
        this.projectRecord = data.data
      }
    })
    this.dataService.setLoading1(true);
    this.dataService.granttChart(this.projectId).subscribe(data => {
      const tempData = data.data;
      const finalData = [];
      tempData.forEach(element => {
        element.goal.forEach(ele1 => {
          const goalData = {
            pID: ele1.pID,
            pName: ele1.pName,
            pStart: ele1.pStart,
            pEnd: ele1.pEnd,
            pClass: ele1.pClass,
            pLink: "",
            pMile: 0,
            pRes: "Brian",
            pComp: 0,
            pGroup: 1,
            pParent: 0,
            pOpen: 1,
            pDepend: "",
            pCaption: "",
            pNotes: "Some Notes text"
          }

          finalData.push(goalData)
          const objectivesList = element.objectives.filter((item) => {
            if (ele1.id === item.goalsId) {
              finalData.push(item);
              const strategyList = element.strategy.filter((item1) => {
                if (ele1.id === item1.goalsId && item1.objectiveId === item.id) {
                  finalData.push(item1);
                  const tatcicList = element.tatcic.filter((tatcicItem) => {
                    if (ele1.id === tatcicItem.goalsId && tatcicItem.strategyId === item1.id) {
                      finalData.push(tatcicItem);

                      const activityList = element.activity.filter((activityItem) => {
                        if (ele1.id === activityItem.goalsId && activityItem.tacticsId === tatcicItem.id) {
                          finalData.push(activityItem);
                        }
                      });

                    }
                  });
                }
              });
            }
          });

        });
        //     element.objectives.forEach(ele3 => {
        //       this.data.push(ele3)
        //     });
        //     element.strategy.forEach(ele4 => {
        //       this.data.push(ele4)
        //     });
        //     element.tatcic.forEach(ele5 => {
        //       this.data.push(ele5)
        //     });
        //     element.activity.forEach(ele2 => {
        //       this.data.push(ele2)
        //     });

      });
      this.dataDev = finalData;
      console.log("this.data===>",this.data);
      this.dataInit();
      this.dataService.resetLoading1(false);
    })


  }

  ngOnInit() {
    // this.data = this.initialData();
    // this.data = editingData;
    this.data = editingData;
        this.taskSettings = {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            child: 'subtasks'
        };
        this.toolbar =  ['PdfExport'];
    }
    public toolbarClick(args: ClickEventArgs): void {
            if (args.item.id === 'ganttDefault_pdfexport') {
                let exportProperties: PdfExportProperties = {
                   fileName:"new.pdf"
                };
                this.ganttChart.pdfExport(exportProperties);
            }
    };

  dataInit() {
    this.editorOptions = {
      vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,
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
        cost: console.log
      },

      vResources: [
        { id: 0, name: 'Anybody' },
        { id: 1, name: 'Mario' },
        { id: 2, name: 'Henrique' },
        { id: 3, name: 'Pedro' }
      ],
      vEventClickRow: console.log,
      vTooltipDelay: this.delay,
      vDebug: this.vDebug === 'true',
      vEditable: this.vEditable === 'true',
      vUseSort: this.vUseSort === 'true',
      vFormatArr: ['Day', 'Week', 'Month', 'Quarter'],
      vFormat: 'week'
    };
    this.editor.setOptions(this.editorOptions);
  }
  changeData() {
    this.data = [... this.data,
    {
      pID: Math.random() * 100,

      pName: "new item",
    }];
  }
  showSpinner = false;
  anand: any;
  ngAfterViewInit(): void {
    // this.anand = this.screen.nativeElement;
    this.anand = document.querySelector('#printchart')
    console.log("after view======>", this.anand);
  }
  downloadImage() {
    var doc = new jsPDF();
var ele = document.getElementById('editor');
// console.log(ele);
html2canvas(ele).then(canvas => {
  // this.saveAs(canvas.toDataURL("image/png"), `canvas.png`)
   var base64image = canvas.toDataURL("image/png",0.5);

// Split the base64 string in data and contentType
var block = base64image.split(",");
// console.log(block[1]);

// this.saveAs(base64image,"dev.png");

var link = document.createElement('a');
link.href = base64image;
      link.download = "dev.png";

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();
});
/*doc.html(ele, {
   callback: function (doc) {
     doc.save();
   },
   x: 10,
   y: 10
});*/
  }

  saveAs(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();
    } else {
      window.open(uri);
    }
  }
   downloadImageDEV() {
    // const doc = new jsPDF();
    
    // const pdfTable = this.pdfTable.nativeElement;
    // console.log("pdfTable==>",pdfTable);
    
    // var html = htmlToPdfmake(pdfTable.innerHTML);
      
    // const documentDefinition = { content: html };
    // pdfMake.createPdf(documentDefinition).open();

    // htmlToImage.toPng(document.getElementById('mainImg')).then(function (dataUrl) {
    //   download(dataUrl, 'grantt' + Date.now() + '.png');
    //   });


  //   html2canvas(this.screen.nativeElement).then((canvas) =>{
  //     canvas.width = 1024 * 1;
  //     canvas.height = 524;
  //     const base64Image = canvas.toDataURL("image/png".length);
  //     var anchor = document.createElement('a');
      
  //     anchor.setAttribute("href", base64Image);
  //     anchor.setAttribute("download", "myimage.png");
  //     anchor.click();
  //     anchor.remove();
  // });

//   console.log("after view======>", this.anand);
// console.log("document.querySelector('#printchart')===>",this.screen.nativeElement);
// console.log("document.querySelector('#imageLink')===>",document.querySelector('#imageLink'));
//   html2canvas(this.anand).then(canvas => {
//     // document.body.appendChild(canvas)
//     console.log("canvas===>",canvas);
//     canvas.width = 500;
//     canvas.height = 500;
//     // this.canvas.nativeElement.src = canvas.toDataURL();
//     // document.querySelector('#imageLink').setAttribute('src') =  canvas.toDataURL();
//       this.downloadLink.nativeElement.href = canvas.toDataURL('image/png',500);
//       this.downloadLink.nativeElement.download = 'grantt' + Date.now() + '.png';
//       this.downloadLink.nativeElement.click();
//});

  
    // this.spiner.show();
    // this.showSpinner = true;
    //  html2canvas(this.anand).then(canvas => {
    //   console.log("canvas.toDataURL()====>",canvas.toDataURL());
    //   this.canvas.nativeElement.src = canvas.toDataURL();
    //   this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
    //   this.downloadLink.nativeElement.download = 'grantt' + Date.now() + '.png';
    //   this.downloadLink.nativeElement.click();
    //   this.showSpinner = true;
    //   this.spiner.hide();
    // });
    // setTimeout(() => {
    //   /** spinner ends after 20 seconds */
    //   this.showSpinner = true;
    //   this.spiner.hide();
    // }, 3000);
    this.cdr.detectChanges();
    const content = document.getElementById('printchart')
    const options = {content,
      filename: 'grantt' + Date.now()+".pdf",
      image: { type: 'jpeg'}, 
      html2canvas: { dpi: 96, letterRendering: true },
      jsPDF: { orientation: 'landscape'}
    };
   
    html2pdf().from(content).set(options).save();
  }

 

  initialData() {
    return [
      {
        pID: "g1",
        pName: "Goal1",
        pStart: "2017-02-20",
        pEnd: "2017-03-16",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 0,
        pGroup: 1,
        pParent: 0,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: "Some Notes text"
      },
      {
        pID: "o1",
        pName: "Objective1",
        pStart: "2017-02-20",
        pEnd: "2017-02-25",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 50,
        pGroup: 0,
        pParent: "g1",
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: "s1",
        pName: "Strategy1",
        pStart: "2017-02-20",
        pEnd: "2017-02-29",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 30,
        pGroup: 0,
        pParent: "o1",
        pOpen: 1,
        pDepend: "o1",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 12,
        pName: "Objective2",
        pStart: "2017-02-20",
        pEnd: "2017-02-25",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Brain",
        pComp: 100,
        pGroup: 0,
        pParent: 1,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: "g2",
        pName: "Goal2",
        pStart: "",
        pEnd: "",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 0,
        pGroup: 1,
        pParent: 0,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: "o2",
        pName: "Objective11",
        pStart: "2017-02-25",
        pEnd: "2017-02-29",
        pClass: "gtaskpurple",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 30,
        pGroup: 0,
        pParent: "g2",
        pOpen: 1,
        pDepend: "g2",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 32,
        pName: "Objective22",
        pStart: "2017-02-25",
        pEnd: "2017-02-29",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 30,
        pGroup: 0,
        pParent: "g2",
        pOpen: 1,
        pDepend: "g2",
        pCaption: "",
        pNotes: ""
      },
      {
        pID: 33,
        pName: "Objective33",
        pStart: "2017-02-21",
        pEnd: "2017-02-29",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 30,
        pGroup: 0,
        pParent: "g2",
        pOpen: 1,
        pDepend: "g2",
        pCaption: "",
        pNotes: ""
      },
    ];
  }
}
export let editingResources: Object[] = [
  { resourceId: 1, resourceName: 'Martin Tamer' },
  { resourceId: 2, resourceName: 'Rose Fuller' },
  { resourceId: 3, resourceName: 'Margaret Buchanan' },
  { resourceId: 4, resourceName: 'Fuller King' },
  { resourceId: 5, resourceName: 'Davolio Fuller' },
  { resourceId: 6, resourceName: 'Van Jack' },
  { resourceId: 7, resourceName: 'Fuller Buchanan' },
  { resourceId: 8, resourceName: 'Jack Davolio' },
  { resourceId: 9, resourceName: 'Tamer Vinet' },
  { resourceId: 10, resourceName: 'Vinet Fuller' },
  { resourceId: 11, resourceName: 'Bergs Anton' },
  { resourceId: 12, resourceName: 'Construction Supervisor' }
];

export let editingData: Object[] = [
  {
      TaskID: 1,
      TaskName: 'Project Initiation',
      StartDate: new Date('04/02/2019'),
      EndDate: new Date('04/21/2019'),
      subtasks: [
          { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 90 },
          { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 40  },
          { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 10 },
      ]
  },
  {
      TaskID: 5,
      TaskName: 'Project Estimation',
      StartDate: new Date('04/02/2019'),
      EndDate: new Date('04/21/2019'),
      subtasks: [
          { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 85 },
          { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 15 },
          { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 70 }
      ]
  },
];


export let projectResources: Object[] = [
  { resourceId: 1, resourceName: 'Project Manager' },
  { resourceId: 2, resourceName: 'Software Analyst' },
  { resourceId: 3, resourceName: 'Developer' },
  { resourceId: 4, resourceName: 'Testing Engineer' }
];

export let projectData: Object[] = [
  {
      taskID: 1,
      taskName: 'Project Schedule',
      startDate: new Date('02/08/2019'),
      endDate: new Date('03/15/2019'),
      subtasks: [
          {
              taskID: 2,
              taskName: 'Planning',
              startDate: new Date('02/08/2019'),
              endDate: new Date('02/12/2019'),
              subtasks: [
                  {
                      taskID: 3, taskName: 'Plan timeline', startDate: new Date('02/08/2019'),
                      endDate: new Date('02/12/2019'), duration: 5, progress: '100', resourceId: [1]
                  },
                  {
                      taskID: 4, taskName: 'Plan budget', startDate: new Date('02/08/2019'),
                      endDate: new Date('02/12/2019'), duration: 5, progress: '100', resourceId: [1]
                  },
                  {
                      taskID: 5, taskName: 'Allocate resources', startDate: new Date('02/08/2019'),
                      endDate: new Date('02/12/2019'), duration: 5, progress: '100', resourceId: [1]
                  },
                  {
                      taskID: 6, taskName: 'Planning complete', startDate: new Date('02/10/2019'),
                      endDate: new Date('02/10/2019'), duration: 0, predecessor: '3FS,4FS,5FS'
                  }
              ]
          },
      ]
  }
];