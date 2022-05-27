import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SortCriteria } from "../sort.pipe";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  projectRecord: [];
  errMessage: any;
  ids: any;
  singleList: any;
  public criteria!: SortCriteria;
  closeResult: string;
  editMode = 0;
  submitted = false;
  status = false;
  opened = false;
  regionForm: FormGroup;
  headingText = "Add Product";
  buttonText = "Create";
  tomorrow = new Date();
  nextYear = new Date();
  regionRecord: any;
  menuStatus: any;
  statusList = [{
    title: "My Tasks"
  },
  {
    title: "Products"
  },
  {
    title: "History"
  },
  {
    title: "Status"
  },
  {
    title: "Activity"
  },
  ]

  statusRecord = [
    {
      id: '',
      title: "Goal",
      type: "Goal",
    },
    {
      id: '',
      title: "Objective",
      type: "Objective",
    },
    {
      id: '',
      title: "Strategy",
      type: "Strategy",
    },
    {
      id: '',
      title: "Tactic",
      type: "Tactic",
    },
    {
      id: '',
      title: "Key Activity",
      type: "Key Activity",
    }]
  id: Number;
  countAarray = [{ title: 5 }, { title: 10 }, { title: 15 }, { title: 20 }, { title: 25 }, { title: 50 }, { title: 100 },]
  taskStatus = [{ title: 'Not Started' }, { title: 'Started' }, { title: 'Delayed' }, { title: 'At Risk' }, { title: 'Completed' }]
  todotask = ['Not Started', 'Started', 'Delayed', 'At Risk', 'Completed']
  productForm: FormGroup;
  workStreamRecord = [];
  selectedItems = [];
  dropdownSettings = {};
  dropdownSettings1 = {};
  dropdownSettings2 = {};
  objectiveList: any;
  recordAny: any;
  activity: any;
  goal: any;
  objectives: any;
  tactic: any;
  statagy: any
  selectcItems = [];
  widgetForm: FormGroup;
  EventType: any;
  permissions: any;
  productPermission: any;
  widgetPermission: any;
  domainExits: any;
  url: any;
  tokenStorage: any;
  token: any;
  buttonFalse = false;
  siteRecord: any;
  list: any;
  select = false;
  projectRecords: any;
  dropdownList = [];
  widgetRecord: any;
  taskAssignmnet = [];
  history: any;
  constructor(private dataService: DataService, private titleService: Title, private fb: FormBuilder, private router: Router,
    private toaster: ToastrService, private modalService: NgbModal, private spinner: NgxSpinnerService, private route: ActivatedRoute,) {
    this.dataService.planExpiredOrNot().subscribe(data => {
      if (data.status == 200) {
        localStorage.setItem('employeeRecord', JSON.stringify(data?.data))
      }
      else if (data.status == 402) {
        this.router.navigate(['/UpgradePlanPrice'])
      }
    });
    this.dataService.getSiteSetting().subscribe(data => {
      if (data.status == 200) {
        this.siteRecord = data?.data;
        localStorage.setItem('domain', this.siteRecord?.title);
        this.url = window.location.hostname;
        const subdomain = this.url.split('.');
        // const orogincalUrl = subdomain[0];
        // if (orogincalUrl == 'localhost') {

        // }
        // else if (orogincalUrl == 'lyllilaunchtools') {
        // }
        // else if (this.siteRecord?.domain == orogincalUrl) {

        // }
        // else {
        //   this.router.navigate(['/not-found']);
        // }
      }
    })
    this.route.params.subscribe(params => {
      this.tokenStorage = params.token;
    });

    if (this.tokenStorage) {
      this.dataService.loginTok(this.tokenStorage);
      this.dataService.resetHome(false);
      localStorage.setItem('companyToken', this.tokenStorage);
      localStorage.setItem('login', 'true');
    }
    this.getRegionList();
    this.productForm = this.fb.group({
      projectName: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      regionId: ['', [Validators.required]],
      workStream: ['', [Validators.required]]
    });
    this.widgetForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      widgetJson: '',
      statusValue: "",
      count: ''
    });

    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'products') {
            this.productPermission = element
          }
          if (element.permission.actionUrl == 'widget') {
            this.widgetPermission = element
          }
        });
      }

      if (results.status == 404) {
        this.productPermission = results.data;
        this.widgetPermission = results.data;
        // this.toaster.error("No Permission")
      }
    })
    this.dataService.projectList().subscribe(data => {
      if (data.status == 200) {
        this.projectRecord = data.data;
        this.dataService.resetLoading(false);
      }
      if (data.status == 404) {
        this.errMessage = "No Record Found";
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    });

    this.dataService.resetHome(false);



    this.workSreamList();
    this.dataService.getRegion().subscribe((data: any) => {
      if (data.status == 200) {
        this.regionRecord = data.data
      }
      if (data.status == 404) {
        // this.toaster.error('No Record Found!');
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
      this.widgetList();
    });
    this.criteria = {
      property: 'name',
      descending: false
    };
    this.dropdownSettings = {
      singleSelection: false,
      labelKey: 'name',
      primaryKey: 'id',
      text: "Select WorkStream",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      itemsShowLimit: 3,
      classes: "myclass custom-class"
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      labelKey: 'title',
      primaryKey: 'id',
      text: "Select Status",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      itemsShowLimit: 3,
      classes: "myclass custom-class"
    }
    this.dropdownSettings2 = {
      singleSelection: false,
      labelKey: 'projectName',
      primaryKey: 'id',
      text: "Select Product",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      itemsShowLimit: 3,
      classes: "myclass custom-class"
    };
    let obj = localStorage.getItem('menuStatus');
    if (obj == 'true') {
      this.status = true
      this.opened = true
    }
    else {
      this.opened = false
      this.status = false
    }
    // this.setDocTitle("hello")
  }
  dropTo(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  };

  ngOnInit(): void {
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    if (event.previousContainer.id === event.container.id) {
      this.dataService.updatePositionWidget(event.container.data).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Updated Successfully');
        }
        if (data.status == 500) {
          this.toaster.error('Unable To Process, please try again later')
        }
      });
    }
    else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex,
        event.currentIndex);
    };
  };
  selectType = false;
  selectItem = false;
  productdetails(project: any) {
    localStorage.setItem('projectId', project.id)
    this.router.navigateByUrl('/product-detail/' + project.id);
  };
  onItemSelect(item: any) {
    if (this.widgetForm.value.type == 'My Tasks') {
      this.selectType = true;
    }
    if (this.widgetForm.value.type == 'Activity') {
      this.checked = true;
      this.selectType = false;

    }
    if (this.widgetForm.value.type == 'Products') {
      this.selectType = false;
    }

    this.selectedItems.push(item);

  }
  OnItemDeSelect(item: any) {
    this.selectedItems.splice(this.selectedItems.indexOf(item.id), 1);
  };
  onSelectAll(items: any) {
    items.forEach(element => {
      this.selectedItems.push(element);
    });
    if (this.widgetForm.value.type == 'My Tasks') {
      this.selectType = true;
    }
    if (this.widgetForm.value.type == 'Activity') {
      this.checked = true;
      this.selectType = false;

    }
    if (this.widgetForm.value.type == 'Products') {
      this.selectType = false;
    }

  };
  onDeSelectAll(items: any) {
    this.selectedItems = []
  };

  logOut() {
    this.dataService.logout()
  };
  onOpenedChange(e: any) {
    localStorage.setItem('menuStatus', e)
  }
  decisionAction(data: any, type: any) {
    this.ids = data.id;
    if (type == 'project') {
      this.singleList = data.projectName;
    }
    else {
      this.singleList = data.name;
    }
    this.dataService.setNewUserInfo({
      projectId: data.id,
      type: type,
      taskType: type
    });

  }
  openSm(content, element, type: number) {
    if (this.productPermission.insert == true) {
      this.status = true;
      this.editMode = 0;
      this.headingText = "Add Product"
      this.buttonText = "Create"
      this.productForm.patchValue({
        projectName: "",
        responsivePerson: "",
        startDate: "",
        endDate: "",
        status: "",
        regionId: "",
      })
      this.modalService.open(content, { size: 'md' });
    }
    else {
      this.toaster.error("you don't have permission to access this resource");
    }
  }

  openWidget(content, element, type: number) {
    if (this.widgetPermission.insert == true) {
      if (type == 0) {
        this.editMode = 0;
        this.id = 0;
        this.selectedItems = [];
        this.status = true;
        this.select = false;
        this.widgetForm.get('type').enable();
        this.headingText = "Add Feature"
        this.buttonText = "Create";
        this.widgetForm.reset();
        this.widgetForm.patchValue({
          type: "",
          name: "",
          widgetJson: "",
          taskJson: "",
          count: ""
        })
        // this.widgetForm.value.type
      }
    } else {
      this.toaster.error("you don't have permission to access this resource");
    }

    if (this.widgetPermission.update == true) {
      if (type == 1) {
        let taskJsonValue
        this.id = element.id;
        this.editMode = 1;
        this.select = false;
        this.headingText = "Edit Feature";
        this.buttonText = "Update";
        this.widgetForm.get('type').disable();
        if (element.type == 'Status') {
          this.selectType = true;
        }
        else {
          taskJsonValue = ''
          this.selectType = false;
        }
        element.widgetJson.forEach(ele => {
          delete ele.activity;
          delete ele.goal;
          delete ele.objective;
          delete ele.tactic;
          delete ele.strategy;
          delete ele.Completedactivity
          delete ele.Completedgoal
          delete ele.Completedobjective
          delete ele.Completedstrategy
          delete ele.Completedtactic
        });
        this.selectedItems = [];
        element.widgetJson.forEach(element => {
          this.selectedItems.push(element);
        });
        let valueStatus;
        if (element.type == 'My Tasks') {
          this.select = true;
          this.selectType = true;
          valueStatus = element.taskJson[0].type
        }
        else if (element.type == 'Products') {
          this.select = true;
          this.selectType = false;
          valueStatus = element.taskJson[0].type
        }
        else if (element.type == 'Status') {
          this.select = false;
          this.checked = false;
          valueStatus = element.taskJson[0].type
        }
        else if (element.type == 'Activity') {
          this.select = true;
          this.selectType = false;
          this.checked = true;
          this.EventType = 'Activity';
          element.taskJson.forEach(ele => {
            ele.title = ele.type;
            ele.id = ele.id
            ele.type = ele.type;
            this.statusRecord.forEach(ele1 => {
              if (ele.type == ele1.type) {
                ele1.id = ele.id
              }
            });

            var result: any = this.statusRecord.filter(e => {
              var key = Object.keys(e).map(k => e[k]).join('|');
              if (!this[key]) {
                this[key] = true;
                return true;
              }
              return false;
            }, {});
            this.statusRecord.push(result);
            // this.statusRecord.filter((item, i, ar) => ar.indexOf(item) === i)
          })
          element.taskJson.forEach(element => {
            const obj = {
              porjectId: element.id,
              activityName: element.type
            }
            this.dropdownList.push(obj)
          });


          this.newArray = element.taskJson;

        }
        this.widgetForm.patchValue({
          statusValue: "" + valueStatus,
          type: "" + element.type,
          name: "" + element.name,
          widgetJson: this.selectedItems.filter((item, i, ar) => ar.indexOf(item) === i),
          count: "" + element.limit
        })
      }
      this.modalService.open(content, { size: 'md' });
    }
    else {
      this.toaster.error("you don't have permission to access this resource");
    }

  };

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.productForm.invalid) {
      //console.table(this.productForm.value);
      return
    }
    if (this.productForm.valid) {
      //console.table(this.productForm.value);
    }
    this.dataService.setLoading(true);
    this.dataService.addProject({
      projectName: this.productForm.value.projectName,
      startDate: this.productForm.value.startDate,
      endDate: this.productForm.value.endDate,
      regionId: this.productForm.value.regionId,
      status: 'Started',
      workStream: this.selectedItems
    }).subscribe((data: any) => {
      if (data?.status == 200) {
        this.router.navigateByUrl('/products');
        this.toaster.success('Project Add Successfully');
        this.productForm.reset()
        this.modalService.dismissAll();
        this.submitted = false;
        this.dataService.resetLoading(false);
      }
      if (data?.status == 208) {
        this.toaster.error('Project Name Already Exists ');
      }
      if (data?.status == 429) {
        this.toaster.error(' You have reached project add limit purchase new plan');
      }
      if (data?.status == 204) {
        this.toaster.error('Fiels Is Empty');
      }
      if (data?.status == 500) {
        this.toaster.success('Unable To Process');
      }
    })
  }
  changeRegion(event: any) {
    this.productForm.value.regionId;
  }
  get f() {
    return this.productForm.controls;
  }
  get f1() {
    return this.widgetForm.controls;
  }
  workSreamList() {
    this.dataService.workStreamList().subscribe(data => {
      if (data.status == 200) {
        this.workStreamRecord = data.data;
      }
      if (data.status == 404) {
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  menuCollpase() {
    this.dataService.toggleSideNav()
  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }

  action(item: any) {
    this.ids = item.id;
    this.dataService.setNewUserInfo({
      projectId: item.id,
      type: item.type,
      taskType: item.type
    });
    if (item.type == 'strategy') {
      const obj = {
        projectName: item.title
      }
      this.singleList = obj
    }
    if (item.type == 'goal') {
      const obj2 = {
        projectName: item.title
      }
      this.singleList = obj2

    }
    else if (item.type == 'objective') {
      const obj1 = {
        projectName: item.title
      }
      this.singleList = obj1
    }
    else if (item.type == 'title') {
      const obj3 = {
        projectName: item.name
      }
      this.singleList = obj3
    }
    else if (item.type == 'title') {
      const obj4 = {
        projectName: item.name
      }
      this.singleList = obj4
    }

  }

  selectTypeOfWidget(type: any) {
    if (this.widgetForm.value.type == 'My Tasks') {
      this.dataService.setLoading(true)
      this.select = true;
      this.checked = false;
      this.dataService.projectList().subscribe(data => {
        if (data.status == 200) {
          this.projectRecord = data.data;
          this.dataService.resetLoading(false);
        }
        if (data.status == 404) {
          this.errMessage = "No Record Found";
          ////
        }
        if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }

      })
    }
    if (this.widgetForm.value.type == 'Products') {
      this.dataService.setLoading(true)
      this.select = true;
      this.checked = false;
      this.selectType = false;
      this.dataService.projectList().subscribe(data => {
        if (data.status == 200) {
          this.projectRecord = data.data;
          this.dataService.resetLoading(false);
        }
        if (data.status == 404) {
          this.errMessage = "No Record Found";
          //
        }
        if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }

      })
    }
    if (this.widgetForm.value.type == 'History') {
      this.select = false;
      this.checked = false;
      this.dataService.projectList().subscribe(data => {
        if (data.status == 200) {

          this.projectRecord = data.data;
          this.dataService.resetLoading(false);
        }
        if (data.status == 404) {
          this.errMessage = "No Record Found";
          //
        }
        if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }

      })

    }
    if (this.widgetForm.value.type == 'Activity') {
      this.dataService.setLoading(true);
      this.select = true;
      this.selectType = false;
      this.checked = false;
      this.dataService.projectList().subscribe(data => {
        if (data.status == 200) {
          this.projectRecord = data.data;
          this.dataService.resetLoading(false);
        }
        if (data.status == 404) {
          this.errMessage = "No Record Found";
          //
        }
        if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }

      })
    }
    if (this.widgetForm.value.type == 'Status') {
      this.selectType = true;
      this.select = false;
      this.selectedItems.push({ "id": "project" })
    }
  }
  //create create widget
  createWidget() {
    if (this.id > 0) {
      this.updateWidget();
    }
    else {

      if (this.widgetForm.value.type == 'Activity') {
        this.newArray1 = this.newArray;

      }
      let obj;
      if (this.widgetForm.value.type == 'History') {
        obj = {
          name: this.widgetForm.value.name,
          type: this.widgetForm.value.type,
          limit: parseInt(this.widgetForm.value.count),
          widgetJson: this.selectedItems,
        }
      }
      else {
        obj = {
          name: this.widgetForm.value.name,
          type: this.widgetForm.value.type,
          widgetJson: this.selectedItems,
          taskJson: this.newArray1,
          limit: parseInt(this.widgetForm.value.count)
        }

      }
      this.submitted = true;
      if (this.widgetForm.invalid) {
        return
      }
      if (this.widgetForm.valid) {
      }
      this.dataService.createWidget(obj).subscribe(data => {
        if (data.status == 200) {
          this.modalService.dismissAll();
          this.widgetForm.reset();
          this.submitted = false;
          this.toaster.success('Widget Created Successfully');
          this.widgetList();
        }
        if (data.status == 208) {
          this.toaster.error('Widget Already Exists');
        }
        if (data.status == 500) {
          this.toaster.error('Unable To Process, please try again later');
        }
      })
    }


  }

  widgetList() {
    if (this.widgetPermission?.view == true) {
      this.dataService.setLoading(true);
      this.dataService.listWidget().subscribe(results => {
        if (results.status == 200) {
          this.widgetRecord = results.data;
          this.dataService.resetLoading(false);
        }
        if (results.status == 404) {
          this.errMessage = "Start adding your first feature by clicking on “Add Feature” button";
          this.dataService.resetLoading(false);
          //   this.toaster.error("No Record Found!");
        }
        if (results.status == 500) {
          this.toaster.error("Unable To Process, please try again later")
        }
      })
    }
    else {
      // this.toaster.error("you don't have permission to access this resource");
    }

  }
  delete(id: any) {
    if (this.widgetPermission.delete == true) {
      this.dataService.setLoading(true);
      this.dataService.deteleWidget(id).subscribe(data => {
        if (data.status == 200) {
          this.widgetList();
          this.toaster.success('Deleted Successfully');
          this.dataService.resetLoading(false);
        }
        else if (data.status == 404) {
          //
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process, please try again later');
        }
      })
    }
    else {
      this.toaster.error("you don't have permission to access this resource");
    }


  }
  checked = false
  newArray1: any
  newArray = [];
  statusValue: any
  SelectOne(e: any, value: any, data) {
    if (e.target.checked === true) {
      this.newArray.push({
        id: data.id,
        type: value.title
      })

    }
    else if (e.target.checked === false) {
      this.newArray.splice(this.selectedItems.indexOf(data.id), 1);
    }

  }
  selectStatus(e: any) {
    this.newArray.push({
      type: this.widgetForm.value.statusValue
    })
    this.newArray1 = this.newArray
    this.newArray = [];
  }
  updateWidget() {
    if (this.widgetForm.invalid) {
      return
    }
    if (this.widgetForm.valid) {
    }
    if (this.EventType == 'Activity') {
      this.newArray1 = this.newArray;
    }
    this.dataService.updateWidget(this.id, {
      name: this.widgetForm.value.name,
      type: this.widgetForm.value.type,
      taskJson: this.newArray1,
      widgetJson: this.selectedItems,
      limit: parseInt(this.widgetForm.value.count),
    }).subscribe(data => {
      if (data.status == 200) {
        this.submitted = false;
        this.modalService.dismissAll();
        this.widgetForm.reset();
        this.widgetList();
        this.selectedItems = []
        this.widgetForm.patchValue({
          type: "",
          name: "",
          widgetJson: [],
          taskJson: "",
          count: ""
        })
        this.toaster.success('Updated Successfully');
      }
      if (data.status == 204) {
        this.toaster.error('Updated Successfully');
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process, please try again later');
      }
    })
  }
  regionList = false
  getRegionList() {
    this.dataService.getRegion().subscribe(data => {
      if (data.status == 200) {
        this.regionList = false;
      }
      if (data.status == 404) {
        this.regionList = true
      }
    })
  }
  showSppiner = false
  createDummyData(num: any) {
    //no dummy data
    this.spinner.show();
    this.dataService.craeteDummyContent({ id: "data" }).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        this.toaster.success('Sample Data Imported Successfully!')
        this.widgetList();
        this.getRegionList();
      }
      if (data.status == 404) {
        this.toaster.error('No Dummy data created')
      }
      if (data.status == 500) {
        this.toaster.error('Unbale to process please try again later')
      }
    })
  }

}


