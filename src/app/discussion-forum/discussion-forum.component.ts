import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeHtml, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';
import * as FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-discussion-forum',
  templateUrl: './discussion-forum.component.html',
  styleUrls: ['./discussion-forum.component.scss'],
})
export class DiscussionForumComponent implements OnInit {
  editor = ClassicEditor;
  data: any = `<p>Hello, world!</p>`;
  projectInfo: any;
  show = false;
  projectRecord: any;
  urlRecord: any;
  attentionRecord: any;
  actionRecord: any;
  noRecordUrl: any;
  noRecordComments: any;
  noRecordActionPlan: any;
  noRecordAttention: any;
  decisionForm: FormGroup;
  selectedFiles1?: FileList;
  currentFile?: File;
  selectable = true;
  removable = true;
  empRecord: any;
  employeeRecord: any;
  id: any;
  submitted = false;
  addOnBlur = true;
  commentRecord = [];
  noRecordFound: any;
  timeZoneOffset = new Date();
  commentType = 'comments';
  taskType: any;
  colorClass: any;
  statusList = [{
    title: "Not Started",
  },
  {
    title: "Started",
  }, {
    title: "Delayed",
  },
  {
    title: "At Risk",
  },
  {
    title: "Completed",
  }]
  mentionConfig = {
    triggerChar: '@',
    maxItems: 10,
    labelKey: 'name',
    disableSort: true
  };
  fileError = '';
  fileRecord: any;
  content: SafeHtml;
  userinfo: any;
  taskvalue: any;
  dependacyShow = false;
  dependecyList2: any;
  selectedItems = [];
  dropdownSettings = {};
  uploadvalue = false;
  constructor(private dataService: DataService, private fb: FormBuilder, private router: Router,
    private cd: ChangeDetectorRef,
    private toaster: ToastrService, private datePipe: DatePipe, private spinner: NgxSpinnerService, private titleService: Title) {
    this.dropdownSettings = {
      singleSelection: false,
      labelKey: 'name',
      primaryKey: 'id',
      text: "",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    }
    this.decisionForm = this.fb.group({
      message: ['', [Validators.required]],
    });
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);
    this.dataService.getNewUserInfo().subscribe(info => {
      this.projectInfo = info;
      this.id = this.projectInfo.projectId;
      if (this.projectInfo.taskType == 'goal') {
        this.dependacyShow = false;
      }
      else if (this.projectInfo.taskType == 'objective') {
        this.dependacyShow = false;
      }
      else {
        this.dependacyShow = true;
      }
      if (this.id > 0) {
        this.dataService.productFileList(this.id, this.projectInfo.taskType).subscribe(results => {
          if (results.status == 200) {
            this.fileRecord = results.data;
            this.fileRecord.forEach(element => {
              element.ext = element.file.split('.').pop();
            });
          }
          if (results.status == 404) {
            this.fileError = "No Record Found";
          }
          if (results.status == 500) {
            this.fileError = "Unable To Process";
          }
        })
      }
      this.taskType = this.projectInfo.taskType;
      if (this.id > 0) {
        if (this.projectInfo.type == 'project') {
          this.taskvalue = 'project';
          this.projectListUser()
          this.commentsList('comments');
        }
        if (this.projectInfo.taskType == 'objective') {
          this.commentsList('comments');
          this.taskvalue = "objective";
          this.taskList('objective');
        }
        if (this.projectInfo.taskType == 'goal') {
          this.commentsList('comments');
          this.taskvalue = "goal";
          this.taskList('goal');
        }
        if (this.projectInfo.taskType == 'strategy') {
          this.commentsList('comments');
          this.taskvalue = "strategy";
          this.taskList('strategy');
        }
        if (this.projectInfo.taskType == 'tactics') {
          this.commentsList('comments');
          this.taskvalue = "tactics";
          this.taskList('tactics');
        }
        if (this.projectInfo.taskType == 'activity') {
          this.commentsList('comments');
          this.taskvalue == 'activity';
          this.taskList('activity');
        }

      }
      // }
    })
  }

  ngOnInit(): void {
    this.cd.detectChanges();
  }
  onItemSelect(item: any) {
    this.taskAssigement(item)
  }
  OnItemDeSelect(item: any) {
    this.selectedItems.splice(this.selectedItems.indexOf(item), 1);

  }
  onSelectAll(items: any) {
    this.selectedItems = [];
    this.taskAssigement(items)
    items.forEach(element => {
      this.selectedItems.push(element);
    });
  }
  onDeSelectAll(items: any) {
    this.selectedItems = [];
    delete (items.id)
  }

  getColor(country) {
    switch (country) {
      case 'Not Started':
        return 'bg-task-not-started';
      case 'Started':
        return 'bg-task-started';
      case 'Delayed':
        return 'bg-at-high-risk';
      case 'At Risk':
        return 'bg-at-risk';
      case 'Completed':
        return 'bg-task-completed';
    }
    return null;

  }
  startDate: any;
  endDate: any;
  status: any;
  projectListUser() {
    this.dataService.projetListWithUser(this.id, this.taskvalue).subscribe(results => {
      this.projectRecord = results.data;
      this.projectRecord.forEach(element => {
        element.imgUrl = environment.apiUrl + element?.employee[0]?.profilePic;
        element.name = element?.employee[0]?.name;
        element.idx = element?.employee[0]?.id;
        element.projectId = element?.project?.id;
        this.startDate = element?.project?.startDate;
        this.endDate = element?.project?.endDate;
        this.status = element?.project?.status;
        this.getColor(this.status)
        this.employeeRecord = element.employees;
        this.employeeRecord.forEach(ele => {
          ele.imgUrls = environment.apiUrl + ele?.profilePic;
        });
      });
      if (results.status == 404) {
        // this.toaster.error("No Record Found");
      }
      else if (results.status == 500) {
        this.toaster.error("Unable To Process");
      }
    })
  }
  onSubmit() {
    this.submitted = true;
    if (this.decisionForm.invalid) {
      return
    }
    if (this.decisionForm.valid) {
    }
    this.dataService.createComments({
      message: this.decisionForm.value.message,
      projectId: this.id,
      isActive: 0,
      type: this.commentType,
      taskType: this.taskType
    }).subscribe((data: any) => {
      this.projectListUser();
      if (data?.status == 200) {
        this.decisionForm.reset();
        this.submitted = false;
        this.decisionForm.patchValue({
          message: ""
        })
        if (this.commentType == 'project') {
          this.commentsList(this.commentType);
        }
        if (this.commentType == 'comments') {
          this.commentsList(this.commentType);
        }
        else if (this.commentType == 'action plan') {
          this.commentsList(this.commentType);
        }
        if (this.commentType == 'attention needed') {
          this.commentsList(this.commentType);
        }
        if (this.commentType == 'url') {
          this.commentsList(this.commentType);
        }
        this.toaster.success('Comment added Successfully');
      }
      if (data?.status == 204) {
        this.toaster.error('Fiels Is Empty');
      }
      if (data?.status == 500) {
        this.toaster.success('Unable To Process');
      }

    })
  }

  commentsList(type: any) {
    this.dataService.getComments(this.id, type, this.taskType).subscribe(data => {
      if (data.status == 200) {

        if (this.commentType == 'comments') {
          this.commentRecord = data.data;
          if (this.commentRecord.length > 0) {
            this.commentRecord.forEach((element: any) => {
              element.name = element.user[0].name || undefined || element.user[0].name;
              element.employeeCo = element.user[0].employeeCode
              element.date = this.datePipe.transform(element.createdAt, 'yyyy-MM-dd hh:mm:ss', 'en-US');
              element.profilePic = environment.apiUrl + element.user[0].profilePic;
            })
          }
          else {
            this.noRecordComments = "No Record Found!"
          }
        }
        else if (this.commentType == 'action plan') {
          this.actionRecord = data.data;
          if (this.actionRecord.length > 0) {
            this.actionRecord.forEach((element: any) => {

              element.name = element.user[0].name || undefined || element.user[0].name;
              element.employeeCo = element.user[0].employeeCode
              element.date = this.datePipe.transform(element.createdAt, 'yyyy-MM-dd hh:mm:ss', 'en-US');
              element.profilePic = environment.apiUrl + element.user[0].profilePic;
            })
          }
          else {
            this.noRecordActionPlan = "No Record Found";
          }
        }
        if (this.commentType == 'attention needed') {

          this.attentionRecord = data.data;
          if (this.attentionRecord.length > 0) {
            this.attentionRecord.forEach((element: any) => {

              element.name = element.user[0].name || undefined || element.user[0].name;
              element.employeeCo = element.user[0].employeeCode
              element.date = this.datePipe.transform(element.createdAt, 'yyyy-MM-dd hh:mm:ss', 'en-US');
              element.profilePic = environment.apiUrl + element.user[0].profilePic;
            })
          }
          else {
            this.noRecordAttention = "No Record Found!"
          }
        }
        if (this.commentType == 'url') {
          this.urlRecord = data.data;
          if (this.urlRecord.length > 0) {
            this.urlRecord.forEach((element: any) => {
              element.name = element.user[0].name || undefined || element.user[0].name;
              element.employeeCo = element.user[0].employeeCode
              element.date = this.datePipe.transform(element.createdAt, 'yyyy-MM-dd hh:mm:ss', 'en-US');
              element.profilePic = environment.apiUrl + element.user[0].profilePic;
            })
          }
          else {
            this.noRecordUrl = "No Record Found";
          }
        }
      }
      if (data.status == 404) {
        //
        this.noRecordFound = "No Record Found";
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }

  fileChange(event) {
    this.uploadvalue = true;
    this.dataService.setLoading(true);

    if (event.target.files.length > 0) {
      this.selectedFiles1 = event.target.files;
      const extion = this.selectedFiles1.item(0).name.split('.').pop();
      if (extion == 'jpeg' || extion == 'jpg' || extion == 'png' || extion == 'zip' || extion == 'pdf' || extion == 'xlsx' || extion == 'xlsb' || extion == 'xls' || extion == 'doc' || 'docm' || 'docx') {
        this.dataService.productFIleUpload({
          projectId: this.id,
          taskType: this.taskvalue
        }, this.selectedFiles1.item(0)).subscribe((data: any) => {
          this.noRecordFound = data;
          this.uploadvalue = false;
          if (data.status == 200) {
            this.toaster.success('upload successfully');
            this.dataService.resetLoading(false);
            this.dataService.productFileList(this.id, this.projectInfo.taskType).subscribe(results => {
              if (results.status == 200) {
                this.fileRecord = results.data;
                this.fileRecord.forEach(element => {
                  element.ext = element.file.split('.').pop();
                });

              }
              if (results.status == 404) {
                this.fileError = "No Record Found";
              }
              if (results.status == 500) {
                this.fileError = "Unable To Process";
              }
            })
          }
          if (data.status == 404) {
            this.toaster.success('Please check file format');
          }
          if (data.status == 500) {
            this.toaster.error('Only these formats are allowed: jpeg|jpg|png|zip|pdf|xlsx|xlsb|xls|doc|docm|docx');
          }
        })
      }
      else {
        this.toaster.error('Only these formats are allowed: jpeg|jpg|png|zip|pdf|xlsx|xlsb|xls|doc|docm|docx');
      }
    }

  }

  itemMentioned(tag) {
    return '<a href="#" title="Permanent link">' + tag.name + '</a>';
  }
  get f() { return this.decisionForm.controls; }
  selectedTabValue(event) {
    if (event.tab.textLabel == 'Comments') {
      this.commentType = 'comments';
      this.commentsList(this.commentType);
      this.commentRecord = [];
    }
    else if (event.tab.textLabel == 'Action Plan') {
      this.commentType = 'action plan';
      this.commentsList(this.commentType);
      this.actionRecord = [];
    }
    if (event.tab.textLabel == 'Attention Needed') {
      this.commentType = 'attention needed';
      this.commentsList(this.commentType);
      this.attentionRecord = [];
    }
    if (event.tab.textLabel == 'URL') {
      this.commentType = 'url';
      this.commentsList(this.commentType);
      this.urlRecord = [];
    }
  }
  download(files: any) {
    let fileName = files.file.split('/').pop()
    this.dataService.fileDonwload(fileName).subscribe(data => {
      let downloadURL = window.URL.createObjectURL(data);
      FileSaver.saveAs(downloadURL);
    })
  }
  //assign task now 
  taskAssigement(data: any) {
    this.dataService.assignTask({
      companyId: data.companyId,
      projectId: this.id,
      userId: data.id,
      isActive: 1,
      assignBy: data.idx,
      eventType: this.taskvalue,
      eventId: this.id
    }).subscribe(data => {
      if (data.status == 200) {
        this.projectListUser();
        this.toaster.success('Task assign successfully');
      }
      else if (data.status == 208) {
        this.toaster.error('Task Already Assign');
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }

  delete(id: any) {
    this.dataService.deleteTaskUsingUserId(id).subscribe(data => {
      if (data.status == 200) {
        this.projectListUser();
        this.toaster.success('Task Remove Successfully');
      }
      else if (data.status == 404) {
        //
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  changeDate(e: any, status: any) {
    let obj;
    if (status == 'start') {
      obj = {
        startDate: e.value
      }
    }
    else if (status == 'end') {
      obj = {
        endDate: e.value
      }
    }
    if (this.taskvalue == 'project') {
      this.projectListUser();
      this.dataService.updateProject(this.id, obj).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Updated Successfully');
        }
        else if (data.status == 404) {
          //
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }
      })
    }

    else if (this.taskvalue == 'objective') {
      this.commentsList('comments');
      this.dataService.updateObjective(this.id, obj).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Updated Successfully');
        }
        else if (data.status == 404) {
          //
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }
      })
    }
    else if (this.taskvalue == 'goal') {
      this.dataService.updateGoal(this.id, obj).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Updated Successfully');
        }
        else if (data.status == 404) {
          //
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }
      })
    }
    else if (this.taskvalue == 'strategy') {
      this.dataService.updateStrategy(this.id, obj).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Updated Successfully');
        }
        else if (data.status == 404) {
          //
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }
      })
    }
    else if (this.projectInfo.taskType == 'tactics') {
      this.dataService.updateTactics(this.id, obj).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Updated Successfully');
        }
        else if (data.status == 404) {
          //
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }
      })
    }
    else if (this.projectInfo.taskType == 'activity') {
      this.dataService.updateActivity(this.id, obj).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Updated Successfully');
        }
        else if (data.status == 404) {
          //
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }
      })
    }
  }
  taskList(value: any) {
    this.dataService.taskListWithUser(this.id, value).subscribe(results => {
      this.projectRecord = results.data;
      this.projectRecord.forEach(element => {
        element.imgUrl = environment.apiUrl + element?.employee[0]?.profilePic;
        element.name = element?.employee[0]?.name;
        element.idx = element?.employee[0]?.id;
        if (element.eventType == 'strategy') {
          element.projectId = element.strategy.id;
          this.startDate = element.strategy.startDate;
          this.endDate = element.strategy.endDate;
          this.status = element.strategy.status;
          this.dataService.objctiveDev(element.strategy.pDepend.slice(0, -1)).subscribe(data => {
            if (data.status == 200) {
              this.dependecyList2 = data.data;
            }
          })
        }
        else if (element.eventType == 'goal') {
          element.projectId = element.goal.id;
          this.startDate = element.goal.startDate;
          this.endDate = element.goal.endDate;
          this.status = element.goal.status;
        }
        else if (element.eventType == 'objective') {
          element.projectId = element.objective.id;
          this.startDate = element.objective.startDate;
          this.endDate = element.objective.endDate;
          this.status = element.objective.status;
        }
        else if (element.eventType == 'tactics') {
          element.projectId = element.tactics.id;
          this.startDate = element.tactics.startDate;
          this.endDate = element.tactics.endDate;
          this.status = element.tactics.status;
          this.dataService.strategyDev(element.tactics.pDepend.slice(0, -1)).subscribe(data => {
            if (data.status == 200) {
              this.dependecyList2 = data.data;
            }
          })
        }
        else if (element.eventType == 'activity') {
          element.projectId = element.activity.id;
          this.startDate = element.activity.startDate;
          this.endDate = element.activity.endDate;
          this.status = element.activity.status;
          this.dataService.tacticDev(element.activity.pDepend.slice(0, -1)).subscribe(data => {
            if (data.status == 200) {
              this.dependecyList2 = data.data;
            }
          })
        }



        this.employeeRecord = element.employees;
        this.employeeRecord.forEach(ele => {
          ele.imgUrls = environment.apiUrl + ele.profilePic;
        });
      });
      if (results.status == 404) {

      }
      else if (results.status == 500) {
        this.toaster.error("Unable To Process");
      }
    })
  }
  changeStatus() {
    if (this.taskvalue == "project") {
      this.dataService.updateProject(this.id, {
        status: this.status
      }).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Status Updated Successfully');
        }
        else if (data.status == 304) {
          this.toaster.error('Cannot change status please select friest');
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process, Please try again later');
        }
      })
    }
    else if (this.taskvalue == 'goal') {
      this.dataService.updateGoal(this.id, {
        status: this.status
      }).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Status Updated Successfully');
        }
        else if (data.status == 304) {
          this.toaster.error('Cannot change status please select friest');
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process, Please try again later');
        }
      })
    }
    else if (this.taskvalue == 'activity') {
      this.dataService.updateActivity(this.id, {
        status: this.status
      }).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Status Updated Successfully');
        }
        else if (data.status == 304) {
          this.toaster.error('Cannot change status please select friest');
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process, Please try again later');
        }
      })
    }
    else if (this.taskvalue == 'tactics') {
      this.dataService.updateTactics(this.id, {
        status: this.status
      }).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Status Updated Successfully');
        }
        else if (data.status == 304) {
          this.toaster.error('Cannot change status please select friest');
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process, Please try again later');
        }
      })
    }
    else if (this.taskvalue == 'strategy') {
      this.dataService.updateStrategy(this.id, {
        status: this.status
      }).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Status Updated Successfully');
        }
        else if (data.status == 304) {
          this.toaster.error('Cannot change status please select friest');
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process, Please try again later');
        }
      })
    }
    else if (this.taskvalue == 'objective') {
      this.dataService.updateObjective(this.id, {
        status: this.status
      }).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Status Updated Successfully');
        }
        else if (data.status == 304) {
          this.toaster.error('Cannot change status please select friest');
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process, Please try again later');
        }
      })
    }
  }
}
