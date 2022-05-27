import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';
export interface PeriodicElement {
  profilePic: string;
  name: string;
  email: string;
  phone: number;
  empcode: string;
  region: string;
  role: string;
  action: string;
}
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @Input() max: any;
  tomorrow = new Date();
  nextYear = new Date();
  projectLists = [];
  workStreamRecord = [];
  dataSource: any;
  regionRecord: any;
  submitted = false;
  status: boolean = false;
  roleRecord: any;
  productForm: FormGroup;
  id: any;
  ids: any;
  closeResult: string;
  editMode = 0;
  projectId: any;
  opened = false
  viewRecord: any;
  empRecord: any;
  list: any;
  headingText = "Add Product";
  buttonText = "Create";
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
  selectedItems = [];
  dropdownSettings = {};
  valueFromChild: string;
  permissions: any;
  productPermission: any;
  html = false;
  errMessage: any
  constructor(private dataService: DataService, private titleService: Title, private route: ActivatedRoute, private modalService: NgbModal, private fb: FormBuilder, private router: Router, private toaster: ToastrService, private datePipe: DatePipe,) {
    this.productForm = this.fb.group({
      projectName: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      regionId: ['', [Validators.required]],
      workStream: [''],
    });
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);
    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'products') {
            this.productPermission = element
            if (this.productPermission.view == true) {
              this.html = true
            }
            else {
              // this.toaster.error("you don't have permission to perform this action");
            }
          }
        });
      }
      if (results.status == 404) {
        this.productPermission = results.data;
        if (this.productPermission.view == false) {
          this.html = false
          this.toaster.error("you don't have permission to access this resource");
        }
      }
    })
    this.dataService.resetHome(false);
    this.getProject();
    this.getRegion();
    this.getEmployeeList();
    this.workSreamList();
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.nextYear.setDate(this.nextYear.getDate());
    this.dropdownSettings = {
      singleSelection: false,
      labelKey: 'name',
      primaryKey: 'id',
      text: "Select WorkStream",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    }
    let obj = localStorage.getItem('menuStatus');
    if (obj == 'true') {
      this.status = true
      this.opened = true
    }
    else {
      this.opened = false
      this.status = false
    }
  }

  ngOnInit(): void {

  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }
  onItemSelect(item: any) {

  }
  OnItemDeSelect(item: any) {
    this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
  }
  onSelectAll(items: any) {
    this.selectedItems = [];
    items.forEach(element => {
      this.selectedItems.push(element);
    });
  }
  onDeSelectAll(items: any) {
    this.selectedItems = [];
  }
  addProject(val: any) {
    this.projectId = val;
    this.dataService.passValue(val);
  }
  readOutputValueEmitted(val) {
    this.valueFromChild = val;
    this.getProject();
  }
  getRegion() {
    this.dataService.getRegion().subscribe(data => {
      if (data.status == 200) {
        this.regionRecord = data.data
      }
      if (data.status == 204) {

      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  get f() {
    return this.productForm.controls;
  }
  getProject() {
    this.dataService.setLoading3(true);
    this.dataService.projectList().subscribe(data => {
      if (data.status == 200) {
        this.dataService.resetLoading3(false);
        this.projectLists = data.data;
        this.projectLists.forEach((element: any) => {
          element.startDate = this.datePipe.transform(element.startDate, 'MM-dd-yyyy');
          element.endDate = this.datePipe.transform(element.endDate, 'MM-dd-yyyy');
        });
      }
      else if (data.status == 404) {
        this.dataService.resetLoading3(false);
        this.errMessage = "Start adding your first Product by clicking on “Add New Product” button";

      }
      else if (data.status == 500) {
        this.toaster.error('Unable to process');
      }
    })
  }
  viewDetail(id: any) {
    this.projectId = id;
    this.dataService.passValue(id);
  }
  changeRegion(event: any) {
    this.productForm.value.regionId;
  }
  onSubmit() {
    if (this.id > 0) {
      this.update()
    }
    else {
      this.submitted = true;
      if (this.productForm.invalid) {
        // console.table(this.productForm.value);
        return
      }
      if (this.productForm.valid) {
        // console.table(this.productForm.value);
      }
      this.dataService.setLoading3(true);
      this.dataService.addProject({
        projectName: this.productForm.value.projectName,
        startDate: this.productForm.value.startDate,
        endDate: this.productForm.value.endDate,
        regionId: this.productForm.value.regionId,
        status: 'Started',
        workStream: this.selectedItems
      }).subscribe((data: any) => {
        if (data?.status == 200) {
          this.getProject();
          this.modalService.dismissAll();
          this.productForm.reset();
          this.submitted = false
          this.router.navigateByUrl('/products');
          this.toaster.success('Product Added Successfully');
          this.productForm.reset()
          this.submitted = false;
          this.dataService.resetLoading3(false);
        }
        if (data?.status == 208) {
          this.toaster.error('Product Name Already Exists');
        }
        if (data?.status == 429) {
          this.toaster.error('You have reached Product Add Limit, please upgrade your plan');
        }
        if (data?.status == 204) {
          this.toaster.error('No Content');
        }
        if (data?.status == 500) {
          this.toaster.success('Unable To Process');
        }
      })
    }

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
  delete() {
    this.dataService.deleteProject(this.id).subscribe(data => {
      if (data.status == 200) {
        this.getProject();
        this.toaster.success('Product Deleted Successfully');
        this.modalService.dismissAll();
      }
      else if (data.status == 404) {

      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process!');
      }
    })
  }
  decisionAction(data: any, task: any, taskType) {
    this.ids = data.id;
    this.list = data
    this.dataService.setNewUserInfo({
      projectId: data.id,
      type: task,
      taskType: taskType
    });
  }
  getEmployeeList() {
    this.dataService.employeeList().subscribe(data => {
      if (data.status == 200) {
        this.empRecord = data.data;
      }
      if (data.status == 404) {

      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  selectResponsivePoerson(event: any) {
    this.productForm.value.responsivePerson
  }
  productDetail(project: any) {
    localStorage.setItem('projectId', project.id)
    this.router.navigateByUrl('/product-detail/' + project.id);
  }
  openSm(content, element, type: number) {
    if (type === 1) {
      if (this.productPermission.update == true) {
        this.status = false
        this.editMode = 1;
        this.headingText = "Update Product"
        this.buttonText = "Update"
        this.productForm.patchValue({
          projectName: "" + element.projectName,
          startDate: "" + element.startDate,
          endDate: "" + element.endDate,
          regionId: "" + element.regionId,
          // workStream: "" + element.workStream,
        })
        this.selectedItems = element.workStream;
        this.productForm.get('startDate').patchValue(this.formatDate(element.startDate));
        this.productForm.get('endDate').patchValue(this.formatDate(element.endDate));
        this.modalService.open(content, { size: 'md' });
      }
      else {
        this.toaster.error("you don't have permission to perform this action");
      }

    }

    if (type === 2) {
      if (this.productPermission.view == true) {
        this.status = false
        this.editMode = 2;
        this.headingText = "View Product";
        this.productForm.patchValue({
          projectName: "" + element.projectName,
          startDate: "" + element.startDate,
          endDate: "" + element.endDate,
          regionId: "" + element.regionId,
        });
        this.productForm.get('startDate').patchValue(this.formatDate(element.startDate));
        this.productForm.get('endDate').patchValue(this.formatDate(element.endDate));
        this.modalService.open(content, { size: 'md' });
      } else {
        this.toaster.error("you don't have permission to perform this action");
      }

    }
    if (type === 0) {
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
        this.toaster.error("you don't have permission to perform this action");
      }
    }
    if (type == 4) {
      if (this.productPermission.delete == true) {
        this.modalService.open(content, { size: 'md' });
      }
      else {
        this.toaster.error("you don't have permission to perform this action");
      }

    }
    this.id = element.id;
  }
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
  update() {
    this.submitted = true;
    this.dataService.setLoading3(true);
    this.dataService.updateProject(this.id, {
      projectName: this.productForm.value.projectName,
      startDate: this.productForm.value.startDate,
      endDate: this.productForm.value.endDate,
      regionId: this.productForm.value.regionId,
      workStream: this.selectedItems
    }).subscribe((data: any) => {
      if (data?.status == 200) {
        this.getProject();
        this.modalService.dismissAll();
        this.productForm.reset();
        this.submitted = false
        this.submitted = false;
        this.productForm.patchValue({
          projectName: "",
          responsivePerson: "",
          startDate: "",
          endDate: "",
          status: "",
          regionId: "",
        })
        this.toaster.success('Product Updated Successfully');
        this.dataService.resetLoading3(false);
      }
      if (data?.status == 204) {
        this.toaster.error('No Content');
      }
      if (data?.status == 500) {
        this.toaster.success('Unable To Process');
      }
    })
  }
  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    if (event.previousContainer.id === event.container.id) {
      this.dataService.updateProjectPosition(event.container.data).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Updated Successfully');
        }
        if (data.status == 304) {
          this.toaster.success('Cannot Modify');
        }
        if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }
      })
    }
    else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

  }
}
