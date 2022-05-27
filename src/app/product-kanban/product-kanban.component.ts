import { Component, VERSION, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';

import { Duetostart } from '../kanban/duetostart.model';
import { Startedontrack, Startdoarray } from '../kanban/startedontrack.model';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
declare let html2canvas: any;
@Component({
  selector: 'app-product-kanban',
  templateUrl: './product-kanban.component.html',
  styleUrls: ['./product-kanban.component.scss']
})
export class ProductKanbanComponent implements OnInit {
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  showSpinner = false
  projectRecod: any;
  header = ['Not Started', 'Started', 'Delayed', 'At Risk', 'Completed']
  name = 'Angular Material ' + VERSION.major + ' Kanban board';
  objective = [];
  goal = [];
  strategy = [];
  activity = [];
  tactics = [];
  projectId: any;
  taskList: any;
  goalList: any;
  startagyList: any;
  objectiveList: any;
  tacticsList: any;
  startedTask = [];
  atRiskTask = [];
  delayedTask = [];
  notStarted = [];
  completedTask = [];
  currentStattus: any;
  opened = false;
  status = false;
  permissions: any;
  kanbanDownload: any;
  public board: Duetostart = new Duetostart('Test Board', [
    new Startdoarray(this.header[0], '21', this.notStarted),
    new Startdoarray(this.header[1], '32', this.startedTask),
    new Startdoarray(this.header[2], '41', this.delayedTask),
    new Startedontrack(this.header[3], '51', this.atRiskTask),
    new Startedontrack(this.header[4], '61', this.completedTask),
  ]);

  constructor(private dataService: DataService, private titleService: Title,
    private toaster: ToastrService, private spinner: NgxSpinnerService) {
    this.projectId = localStorage.getItem('projectId');
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);
    this.dataService.resetHome(false);
    this.dataService.getProject(this.projectId).subscribe(data => {
      this.projectRecod = data.data;
    })
    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'product-kanban/export-image') {
            this.kanbanDownload = element;
          }
        });
      }
      if (results.status == 404) {
        this.kanbanDownload = results.data;
      }
    })
    let obj = localStorage.getItem('menuStatus');
    if (obj == 'true') {
      this.status = true
      this.opened = true
    }
    else {
      this.opened = false
      this.status = false
    }
    this.taskListOfUser();
  }
  taskListOfUser() {
    this.dataService.setLoading1(true);
    this.dataService.userTaskListProjetWise(this.projectId).subscribe(results => {
      if (results.status == 200) {
        this.dataService.resetLoading1(false);
        if (results.data) {
          this.taskList = results.data
          this.taskList.forEach(element => {
            if (element.status == 'Started') {
              let obj = { id: '', title: '', type: '', goal: [] };
              obj.id = element.id;
              obj.title = element.name;
              obj.type = 'goal';
              obj.goal = element;
              this.startedTask.push(obj);
            }
            if (element.status == 'At Risk') {
              let obj1 = { id: '', title: '', type: '', goal: [] }
              obj1.id = element.id;
              obj1.title = element.name;
              obj1.type = 'goal';
              obj1.goal = element;
              this.atRiskTask.push(obj1);
            }
            if (element.status == 'Delayed') {
              let obj2 = { id: '', title: '', type: '', goal: [] };
              obj2.id = element.id;
              obj2.title = element.name;
              obj2.type = 'goal';
              obj2.goal = element;
              this.delayedTask.push(obj2);
            }
            if (element.status == 'Not Started') {
              let obj3 = { id: '', title: '', type: '', goal: [] };
              obj3.id = element.id;
              obj3.title = element.name;
              obj3.type = 'goal';
              obj3.goal = element;
              this.notStarted.push(obj3)
            }
            if (element.status == 'Completed') {
              let obj4 = { id: '', title: '', type: '', goal: [] };
              obj4.id = element.id;
              obj4.title = element.name;
              obj4.type = 'goal';
              obj4.goal = element;
              this.completedTask.push(obj4)
            }

            if (element.objective) {
              this.objectiveList = element.objective
              this.objectiveList.forEach(ele => {
                if (ele.status == 'Started') {
                  let obj = { id: '', title: '', type: '', objective: [] }
                  obj.id = ele.id
                  obj.title = ele.name;
                  obj.type = 'objective';
                  obj.objective = ele;
                  this.startedTask.push(obj);
                }
                if (ele.status == 'At Risk') {
                  let obj1 = { id: '', title: '', type: '', objective: [] };
                  obj1.id = ele.id;
                  obj1.title = ele.name;
                  obj1.type = 'objective';
                  obj1.objective = ele;
                  this.atRiskTask.push(obj1);
                }
                if (ele.status == 'Delayed') {
                  let obj2 = { id: '', title: '', type: '', objective: [] };
                  obj2.id = ele.id;
                  obj2.title = ele.name;
                  obj2.type = 'objective';
                  obj2.objective = ele;
                  this.delayedTask.push(obj2)
                }
                if (ele.status == 'Not Started') {
                  let obj3 = { id: '', title: '', type: '', objective: [] };
                  obj3.id = ele.id;
                  obj3.title = ele.name;
                  obj3.type = 'objective';
                  obj3.objective = ele;
                  this.notStarted.push(obj3)
                }
                if (ele.status == 'Completed') {
                  let obj4 = { id: '', title: '', type: '', objective: [] };
                  obj4.id = ele.id;
                  obj4.title = ele.name;
                  obj4.type = 'objective';
                  obj4.objective = ele;
                  this.completedTask.push(obj4)
                }
              });

            }
            if (element.strategy) {
              this.startagyList = element.strategy
              this.startagyList.forEach(ele => {
                if (ele.status == 'Started') {
                  let obj = { id: '', title: '', type: '', strategy: [] }
                  obj.id = ele.id;
                  obj.title = ele.name;
                  obj.type = 'strategy';
                  obj.strategy = ele;
                  this.startedTask.push(obj);
                }
                if (ele.status == 'At Risk') {
                  let obj1 = { id: '', title: '', type: '', strategy: [] };
                  obj1.id = ele.id;
                  obj1.title = ele.name;
                  obj1.type = 'strategy';
                  obj1.strategy = ele;
                  this.atRiskTask.push(obj1);
                }
                if (ele.status == 'Delayed') {
                  let obj2 = { id: '', title: '', type: '', strategy: [] }
                  obj2.id = ele.id;
                  obj2.title = ele.name;
                  obj2.type = 'strategy';
                  obj2.strategy = ele;
                  this.delayedTask.push(obj2);
                }
                if (ele.status == 'Not Started') {
                  let obj3 = { id: '', title: '', type: '', strategy: [] }
                  obj3.id = ele.id;
                  obj3.title = ele.name;
                  obj3.type = 'strategy';
                  obj3.strategy = ele;
                  this.notStarted.push(obj3);
                }
                if (ele.status == 'Completed') {
                  let obj4 = { id: '', title: '', type: '', strategy: [] };
                  obj4.id = ele.id;
                  obj4.title = ele.name;
                  obj4.type = 'Started';
                  obj4.strategy = ele;
                  this.completedTask.push(obj4);
                }
              })
            }
            if (element.tactics) {
              this.tacticsList = element.tactics
              this.tacticsList.forEach(ele => {
                if (ele.status == 'Started') {
                  let obj = { id: '', title: '', type: '', tactics: [] }
                  obj.id = ele.id;
                  obj.title = ele.name;
                  obj.type = 'tactics';
                  obj.tactics = ele
                  this.startedTask.push(obj)
                }
                if (ele.status == 'At Risk') {
                  let obj1 = { id: '', title: '', type: '', tactics: [] };
                  obj1.id = ele.id;
                  obj1.title = ele.name;
                  obj1.type = 'tactics';
                  obj1.tactics = ele;
                  this.atRiskTask.push(obj1);
                };
                if (ele.status == 'Delayed') {
                  let obj2 = { id: '', title: '', type: '', tactics: [] };
                  obj2.id = ele.id;
                  obj2.title = ele.name;
                  obj2.type = 'tactics';
                  obj2.tactics = ele;
                  this.delayedTask.push(obj2);
                };
                if (ele.status == 'Not Started') {
                  let obj3 = { id: '', title: '', type: '', tactics: [] };
                  obj3.id = ele.id;
                  obj3.title = ele.name;
                  obj3.type = 'tactics';
                  obj3.tactics = ele;
                  this.notStarted.push(obj3)
                };
                if (ele.status == 'Completed') {
                  let obj4 = { id: '', title: '', type: '', tactics: [] };
                  obj4.id = ele.id;
                  obj4.title = ele.name;
                  obj4.type = 'tactics';
                  obj4.tactics = ele;
                  this.completedTask.push(obj4);
                };
              })
            }
            if (element.activity) {
              this.goalList = element.activity
              this.goalList.forEach(ele => {
                if (ele.status == 'Started') {
                  let obj = { id: '', title: '', type: '', activity: [] };
                  obj.id = ele.id;
                  obj.title = ele.name;
                  obj.type = 'activity';
                  obj.activity = ele;
                  this.startedTask.push(obj);
                }
                if (ele.status == 'At Risk') {
                  let obj1 = { id: '', title: '', type: '', activity: [] };
                  obj1.id = ele.id;
                  obj1.title = ele.name;
                  obj1.type = 'activity';
                  obj1.activity = ele;
                  this.atRiskTask.push(obj1);
                }
                if (ele.status == 'Delayed') {
                  let obj2 = { id: '', title: '', type: '', activity: [] };
                  obj2.id = ele.id;
                  obj2.title = ele.name;
                  obj2.type = 'activity';
                  obj2.activity = ele;
                  this.delayedTask.push(obj2);
                }
                if (ele.status == 'Not Started') {
                  let obj3 = { id: '', title: '', type: '', activity: [] };
                  obj3.id = ele.id;
                  obj3.title = ele.name;
                  obj3.type = 'activity';
                  obj3.activity = ele;
                  this.notStarted.push(obj3);
                }
                if (ele.status == 'Completed') {
                  let obj4 = { id: '', title: '', type: '', activity: [] };
                  obj4.id = ele.id;
                  obj4.title = ele.name;
                  obj4.type = 'activity';
                  obj4.activity = ele;
                  this.completedTask.push(obj4);
                }
              })
            }
            if (results.status == 500) {
              this.toaster.error('Unable To Process');
            }

            if (results.status == 404) {

            }
          })
        }
        /// user part
        else if (results.usertask) {
          this.taskList = results.usertask;
          this.taskList.forEach(element => {
            if (element.goal) {
              this.goalList = element.goal;
              this.goalList.forEach(ele => {
                if (ele.status == 'Started') {
                  let obj = { id: '', title: '', type: '', goal: [] };
                  obj.id = ele.id;
                  obj.title = ele.name;
                  obj.type = 'goal';
                  obj.goal = ele;
                  this.startedTask.push(obj);
                }
                if (ele.status == 'At Risk') {
                  let obj1 = { id: '', title: '', type: '', goal: [] }
                  obj1.id = ele.id;
                  obj1.title = ele.name;
                  obj1.type = 'goal';
                  obj1.goal = ele;
                  this.atRiskTask.push(obj1);
                }
                if (ele.status == 'Delayed') {
                  let obj2 = { id: '', title: '', type: '', goal: [] };
                  obj2.id = ele.id;
                  obj2.title = ele.name;
                  obj2.type = 'goal';
                  obj2.goal = ele;
                  this.delayedTask.push(obj2);
                }
                if (ele.status == 'Not Started') {
                  let obj3 = { id: '', title: '', type: '', goal: [] };
                  obj3.id = ele.id;
                  obj3.title = ele.name;
                  obj3.type = 'goal';
                  obj3.goal = ele;
                  this.notStarted.push(obj3)
                }
                if (ele.status == 'Completed') {
                  let obj4 = { id: '', title: '', type: '', goal: [] };
                  obj4.id = ele.id;
                  obj4.title = ele.name;
                  obj4.type = 'goal';
                  obj4.goal = ele;
                  this.completedTask.push(obj4)
                }
              })
            }
            if (element.objective) {
              this.objectiveList = element.objective
              this.objectiveList.forEach(ele => {
                if (ele.status == 'Started') {
                  let obj = { id: '', title: '', type: '', objective: [] }
                  obj.id = ele.id
                  obj.title = ele.name;
                  obj.type = 'objective';
                  obj.objective = ele;
                  this.startedTask.push(obj);
                }
                if (ele.status == 'At Risk') {
                  let obj1 = { id: '', title: '', type: '', objective: [] };
                  obj1.id = ele.id;
                  obj1.title = ele.name;
                  obj1.type = 'objective';
                  obj1.objective = ele;
                  this.atRiskTask.push(obj1);
                }
                if (ele.status == 'Delayed') {
                  let obj2 = { id: '', title: '', type: '', objective: [] };
                  obj2.id = ele.id;
                  obj2.title = ele.name;
                  obj2.type = 'objective';
                  obj2.objective = ele;
                  this.delayedTask.push(obj2)
                }
                if (ele.status == 'Not Started') {
                  let obj3 = { id: '', title: '', type: '', objective: [] };
                  obj3.id = ele.id;
                  obj3.title = ele.name;
                  obj3.type = 'objective';
                  obj3.objective = ele;
                  this.notStarted.push(obj3)
                }
                if (ele.status == 'Completed') {
                  let obj4 = { id: '', title: '', type: '', objective: [] };
                  obj4.id = ele.id;
                  obj4.title = ele.name;
                  obj4.type = 'objective';
                  obj4.objective = ele;
                  this.completedTask.push(obj4)
                }
              });

            }
            if (element.strategy) {
              this.startagyList = element.strategy
              this.startagyList.forEach(ele => {
                if (ele.status == 'Started') {
                  let obj = { id: '', title: '', type: '', strategy: [] }
                  obj.id = ele.id;
                  obj.title = ele.name;
                  obj.type = 'strategy';
                  obj.strategy = ele;
                  this.startedTask.push(obj);
                }
                if (ele.status == 'At Risk') {
                  let obj1 = { id: '', title: '', type: '', strategy: [] };
                  obj1.id = ele.id;
                  obj1.title = ele.name;
                  obj1.type = 'strategy';
                  obj1.strategy = ele;
                  this.atRiskTask.push(obj1);
                }
                if (ele.status == 'Delayed') {
                  let obj2 = { id: '', title: '', type: '', strategy: [] }
                  obj2.id = ele.id;
                  obj2.title = ele.name;
                  obj2.type = 'strategy';
                  obj2.strategy = ele;
                  this.delayedTask.push(obj2);
                }
                if (ele.status == 'Not Started') {
                  let obj3 = { id: '', title: '', type: '', strategy: [] }
                  obj3.id = ele.id;
                  obj3.title = ele.name;
                  obj3.type = 'strategy';
                  obj3.strategy = ele;
                  this.notStarted.push(obj3);
                }
                if (ele.status == 'Completed') {
                  let obj4 = { id: '', title: '', type: '', strategy: [] };
                  obj4.id = ele.id;
                  obj4.title = ele.name;
                  obj4.type = 'Started';
                  obj4.strategy = ele;
                  this.completedTask.push(obj4);
                }
              })
            }
            if (element.tactics) {
              this.tacticsList = element.tactics
              this.tacticsList.forEach(ele => {
                if (ele.status == 'Started') {
                  let obj = { id: '', title: '', type: '', tactics: [] }
                  obj.id = ele.id;
                  obj.title = ele.name;
                  obj.type = 'tactics';
                  obj.tactics = ele
                  this.startedTask.push(obj);
                }
                if (ele.status == 'At Risk') {
                  let obj1 = { id: '', title: '', type: '', tactics: [] };
                  obj1.id = ele.id;
                  obj1.title = ele.name;
                  obj1.type = 'tactics';
                  obj1.tactics = ele;
                  this.atRiskTask.push(obj1);
                };
                if (ele.status == 'Delayed') {
                  let obj2 = { id: '', title: '', type: '', tactics: [] };
                  obj2.id = ele.id;
                  obj2.title = ele.name;
                  obj2.type = 'tactics';
                  obj2.tactics = ele;
                  this.delayedTask.push(obj2);
                };
                if (ele.status == 'Not Started') {
                  let obj3 = { id: '', title: '', type: '', tactics: [] };
                  obj3.id = ele.id;
                  obj3.title = ele.name;
                  obj3.type = 'tactics';
                  obj3.tactics = ele;
                  this.notStarted.push(obj3)
                };
                if (ele.status == 'Completed') {
                  let obj4 = { id: '', title: '', type: '', tactics: [] };
                  obj4.id = ele.id;
                  obj4.title = ele.name;
                  obj4.type = 'tactics';
                  obj4.tactics = ele;
                  this.completedTask.push(obj4);
                };
              })
            }
            if (element.activity) {
              this.goalList = element.activity
              this.goalList.forEach(ele => {
                if (ele.status == 'Started') {
                  let obj = { id: '', title: '', type: '', activity: [] };
                  obj.id = ele.id;
                  obj.title = ele.name;
                  obj.type = 'activity';
                  obj.activity = ele;
                  this.startedTask.push(obj);
                }
                if (ele.status == 'At Risk') {
                  let obj1 = { id: '', title: '', type: '', activity: [] };
                  obj1.id = ele.id;
                  obj1.title = ele.name;
                  obj1.type = 'activity';
                  obj1.activity = ele;
                  this.atRiskTask.push(obj1);
                }
                if (ele.status == 'Delayed') {
                  let obj2 = { id: '', title: '', type: '', activity: [] };
                  obj2.id = ele.id;
                  obj2.title = ele.name;
                  obj2.type = 'activity';
                  obj2.activity = ele;
                  this.delayedTask.push(obj2);
                }
                if (ele.status == 'Not Started') {
                  let obj3 = { id: '', title: '', type: '', activity: [] };
                  obj3.id = ele.id;
                  obj3.title = ele.name;
                  obj3.type = 'activity';
                  obj3.activity = ele;
                  this.notStarted.push(obj3);
                }
                if (ele.status == 'Completed') {
                  let obj4 = { id: '', title: '', type: '', activity: [] };
                  obj4.id = ele.id;
                  obj4.title = ele.name;
                  obj4.type = 'activity';
                  obj4.activity = ele;
                  this.completedTask.push(obj4);
                }
              })
            }
            if (results.status == 500) {
              this.toaster.error('Unable To Process');
            }

            if (results.status == 404) {

            }
          })
        }

        this.startedTask = [];
        this.atRiskTask = [];
        this.delayedTask = [];
        this.notStarted = [];
        this.completedTask = [];
      }
    })

  }

  downloadImage() {
    this.spinner.show();
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'kanban' + Date.now() + '.png';
      this.downloadLink.nativeElement.click();
    });
    setTimeout(() => {
      /** spinner ends after 20 seconds */
      this.showSpinner = true;
      this.spinner.hide();
    }, 2000);
  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }
  public ngOnInit(): void {

  }

  public dropGrid(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.board.columns, event.previousIndex, event.currentIndex);
  }

  public drop(event: any): void {
    if (event.previousContainer === event.container) {
      let object = event.previousContainer.data[event.previousIndex]
      if (this.selectvalue === 'Not Started') {
        this.currentStattus = 'Not Started';
        if (object.type == 'objective') {
          this.updateObjetive(object.id);
        }
        if (object.type == 'tactics') {
          this.updateTactic(object.id);
        }
        if (object.type == 'strategy') {
          this.updateStratagy(object.id);
        }
        if (object.type == 'goal') {
          this.updateGoal(object.id);
        }
        if (object.type == 'activity') {
          this.updateKeyActivy(object.id);
        }
      }
      else if (this.selectvalue === 'Started') {
        this.currentStattus = 'Started';
        if (object.type == 'objective') {
          this.updateObjetive(object.id);
        }
        if (object.type == 'tactics') {
          this.updateTactic(object.id);
        }
        if (object.type == 'strategy') {
          this.updateStratagy(object.id);
        }
        if (object.type == 'goal') {
          this.updateGoal(object.id);
        }
        if (object.type == 'activity') {
          this.updateKeyActivy(object.id);
        }
      }
      else if (this.selectvalue === 'Completed') {
        this.currentStattus = 'Completed';
        if (object.type == 'objective') {
          this.updateObjetive(object.id);
        }
        if (object.type == 'tactics') {
          this.updateTactic(object.id);
        }
        if (object.type == 'strategy') {
          this.updateStratagy(object.id);
        }
        if (object.type == 'goal') {
          this.updateGoal(object.id);
        }
        if (object.type == 'activity') {
          this.updateKeyActivy(object.id);
        }
      }
      else if (this.selectvalue === 'Delayed') {
        this.currentStattus = 'Delayed';
        if (object.type == 'objective') {
          this.updateObjetive(object.id);
        }
        if (object.type == 'tactics') {
          this.updateTactic(object.id);
        }
        if (object.type == 'strategy') {
          this.updateStratagy(object.id);
        }
        if (object.type == 'goal') {
          this.updateGoal(object.id);
        }
        if (object.type == 'activity') {
          this.updateKeyActivy(object.id);
        }
      }
      else if (this.selectvalue === 'At Risk') {
        this.currentStattus = 'At Risk';
      }

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);


    } else {

      // let array3 = event.container.data.filter(entry1 => !event.previousContainer.data.some((entry2: any) => entry1.id === entry2.id));
      let object = event.previousContainer.data[event.previousIndex]
      if (event.container.id == '21') {
        this.currentStattus = 'Not Started';
      }
      else if (event.container.id == '32') {
        this.currentStattus = 'Started';
      }
      else if (event.container.id == '61') {
        this.currentStattus = 'Completed';
      }
      else if (event.container.id == '41') {
        this.currentStattus = 'Delayed';
      }
      else if (event.container.id == '51') {
        this.currentStattus = 'At Risk';
      }
      if (object.type == 'objective') {
        this.updateObjetive(object.id);
      }
      if (object.type == 'tactics') {
        this.updateTactic(object.id);

      }
      if (object.type == 'strategy') {
        this.updateStratagy(object.id);
      }
      if (object.type == 'goal') {
        this.updateGoal(object.id);

      }
      if (object.type == 'activity') {
        this.updateKeyActivy(object.id);

      }

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  updateGoal(id: any) {
    this.dataService.updateGoal(id, {
      status: this.currentStattus
    }).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Updated Successfully');
        this.taskListOfUser();
      }
      else if (data.status == 404) {

      }
      else if (data.status == 304) {
        this.toaster.error('Not Modify');
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  updateObjetive(id: any) {
    this.dataService.updateObjective(id, {
      status: this.currentStattus
    }).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Updated Successfully');
        this.taskListOfUser();
      }
      else if (data.status == 404) {

      }
      else if (data.status == 304) {
        this.toaster.error('Not Modify');
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  updateStratagy(id: any) {
    this.dataService.updateStrategy(id, {
      status: this.currentStattus
    }).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Updated Successfully');
        this.taskListOfUser();
      }
      else if (data.status == 404) {

      }
      else if (data.status == 304) {
        this.toaster.error('Not Modify');
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  updateTactic(id: any) {
    this.dataService.updateTactics(id, {
      status: this.currentStattus
    }).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Updated Successfully');
        this.taskListOfUser();
      }
      else if (data.status == 404) {

      }
      else if (data.status == 304) {
        this.toaster.error('Not Modify');
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  updateKeyActivy(id: any) {
    this.dataService.updateActivity(id, {
      status: this.currentStattus
    }).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Updated Successfully');
        this.taskListOfUser();
      }
      else if (data.status == 404) {

      }
      else if (data.status == 304) {
        this.toaster.error('Not Modify');
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  selectvalue: any
  selectItem(e: any) {
    this.selectvalue = e.target.innerText;
  }

  save(fileName) {
    this.spinner.show();
    let section = document.querySelector('#mainContainer');
    html2canvas(section).then(canvas => {
      var link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
    });
  }


}
