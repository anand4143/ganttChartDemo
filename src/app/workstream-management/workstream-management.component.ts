import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-workstream-management',
  templateUrl: './workstream-management.component.html',
  styleUrls: ['./workstream-management.component.scss']
})
export class WorkstreamManagementComponent implements OnInit {
  workStreamRecord = [];
  closeResult: string;
  id: any;
  idx: string = '';
  public sideNavState: boolean = false;
  workSteamForm: FormGroup;
  submitted = false;
  headingText = "Add New Workstream";
  buttonText = "Create";
  status: boolean = false;
  menuStatus = false
  editMode = 0;
  dropTargetIds = [];
  regionForm: FormGroup;
  opened = false;
  permissions: any;
  workStreamPermission: any;
  html = false;
  errMessage: any;
  constructor(private dataService: DataService,private titleService:Title, private fb: FormBuilder, private modalService: NgbModal, private toaster: ToastrService, private spinner: NgxSpinnerService) {
    this.workSreamList();
    this.dataService.resetHome(false);
    this.workSteamForm = this.fb.group({
      name: ['', Validators.required]
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
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);
    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {

          if (element.permission.actionUrl == 'workstream-management') {
            this.workStreamPermission = element;
            if (this.workStreamPermission.view == true) {
              this.html = true
            }
            else {
              // this.toaster.error("you don't have permission to access this resource");
            }
          }
        });
      }
      if (results.status == 404) {
        this.workStreamPermission = results.data;
        if (this.workStreamPermission.view == false) {
          this.html = false
          this.toaster.error("you don't have permission to access this resource");
        }
      }
    })


  }
  ngOnInit(): void {
  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }
  workSreamList() {
    this.dataService.setLoading3(true);
    this.dataService.workStreamList().subscribe(data => {
      if (data.status == 200) {
        this.errMessage = '';
        this.workStreamRecord = data.data;
        this.dataService.resetLoading3(false);
      }
      if (data.status == 404) {
        this.workStreamRecord = []
        this.dataService.resetLoading3(false);
        this.errMessage = "Start adding your first Workstream by clicking on “Add New Workstream” button";
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  getId(id: any) {
    this.id = id;
  }
  delete() {
    this.dataService.setLoading3(true);
    this.dataService.deleteWorkStream(this.id).subscribe(data => {
      if (data.status == 200) {
        this.workSreamList();
        this.modalService.dismissAll();
        this.toaster.success('Deleted Successfully');
        this.dataService.resetLoading3(false);
      }
      if (data.status == 404) {
        // this.toaster.error('No Record Found');
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  onSubmit() {
    if (this.id > 0) {
      this.update();
    }
    else {
      this.submitted = false;
      if (this.workSteamForm.invalid) {
        // console.table(this.workSteamForm.value);
        return
      }
      if (this.workSteamForm.valid) {
        // console.table(this.workSteamForm.value);
      }
      this.dataService.setLoading3(true);
      this.dataService.addWorkStream({
        name: this.workSteamForm.value.name
      }).subscribe(data => {
        if (data.status == 200) {
          this.modalService.dismissAll();
          this.workSreamList();
          this.submitted = false;
          this.workSteamForm.reset();
          this.toaster.success('Workstream Added Successfully');
          this.dataService.resetLoading3(false);
        }
        if (data.status == 204) {
          // this.toaster.error('No Content');
        }
        if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }
        if (data.status == 208) {
          this.toaster.error('Workstream Aready Exits');
        }
      })
    }
  }
  get f() {
    return this.workSteamForm.controls;
  }
  update() {
    this.submitted = true;
    if (this.workSteamForm.invalid) {
      // console.table(this.workSteamForm.value);
      return
    }
    if (this.workSteamForm.valid) {
      // console.table(this.workSteamForm.value);
    }
    this.dataService.setLoading3(true);
    this.dataService.updateWorkStream(this.id, {
      name: this.workSteamForm.value.name
    }).subscribe(data => {
      this.workSreamList();
      if (data.status == 200) {
        this.modalService.dismissAll();
        this.workSteamForm.patchValue({
          name: ""
        })
        this.submitted = false;
        this.workSteamForm.reset();
        this.toaster.success('Workstream Updated Successfully');
        this.dataService.resetLoading3(false);
      }
      if (data.status == 204) {
        this.toaster.error('No Content');
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
      if (data.status == 208) {
        this.toaster.error('Workstream Aready Exits');
      }
    })
  }
  openSm(content, element, type: number) {
    if (type === 1) {
      if (this.workStreamPermission.update == true) {
        this.status = false
        this.editMode = 1;
        this.buttonText = "Update";
        this.headingText = "Update Workstream";
        this.workSteamForm.patchValue({
          name: "" + element.name
        });
        this.modalService.open(content, { size: 'md' });
      }
      else {
        this.toaster.error("you don't have permission to access this resource");
      }

    }
    else if (type === 2) {
      if (this.workStreamPermission.view == true) {
        this.status = false
        this.editMode = 2;
        this.headingText = "View Workstream";
        this.workSteamForm.patchValue({
          name: "" + element.name,
        });
        this.modalService.open(content, { size: 'md' });
      }
      else {
        this.toaster.error("you don't have permission to access this resource");
      }
    } else if (type === 0) {
      if (this.workStreamPermission.insert == true) {
        this.status = true;
        this.editMode = 0;
        this.headingText = "Add New Workstream";
        this.buttonText = "Create";
        this.workSteamForm.patchValue({
          name: ""
        });
        this.modalService.open(content, { size: 'md' });
      } else {
        this.toaster.error("you don't have permission to access this resource");
      }

    }
    else if (type === 3) {
      if (this.workStreamPermission.delete == true) {
        this.modalService.open(content, { size: 'md' });
      } else {
        this.toaster.error("you don't have permission to access this resource");
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


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    if (event.previousContainer.id === event.container.id) {
      this.dataService.updateWorkStreamPosition(event.container.data).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Updated Successfully');
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
  onSinenavToggle() {

  }
}
