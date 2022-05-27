import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

export interface PeriodicElement {
  role: string;
  position: number;
  action: string;
}



@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: any;
  closeResult: any;
  id: any;
  errMessage: any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  submitted = false;
  roleForm: FormGroup;
  companyId: any;
  deleteForm: FormGroup;
  status = false;
  opened = false;
  permissions: any;
  rolePermission: any;
  roleHashPermission: any;
  html = false;
  constructor(private dataService: DataService, private toaster: ToastrService,
    private modelService: NgbModal, private router: Router, private titleService: Title,
    private spinner: NgxSpinnerService, private fb: FormBuilder) {
    this.deleteForm = this.fb.group({
      name: ['', [Validators.required]],
    })
    this.dataService.resetHome(false);
    this.roleForm = this.fb.group({
      name: ['', [Validators.required]],
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
    this.roleList();
    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'role') {
            this.rolePermission = element;
            if (this.rolePermission.view == true) {
              this.html = true;
            }
            else {
              // this.toaster.error("you don't have permission to access this resource");
            }
          }
          if (element.permission.actionUrl == 'role-management') {
            this.roleHashPermission = element;

          }

        });
      }
      if (results.status == 404) {
        this.rolePermission = results.data;
        if (this.rolePermission.view == false) {
          this.html = false
          this.toaster.error("you don't have permission to access this resource");
        }
      }
    })
  }
  roleList() {
    this.dataService.setLoading3(true);
    this.dataService.rolesList().subscribe(data => {
      if (data.status == 200) {
        this.dataService.resetLoading3(false);
        this.dataSource = data.data
        // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      }
      else if (data.status == 404) {

      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process!');
      }
    })
  }

  ngOnInit(): void {
  }

  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }
  onSubmit() {
    if (this.id > 0) {
      this.update();
    }
    else {
      this.submitted = true;
      if (this.roleForm.invalid) {
        return;
      }
      if (this.roleForm.valid) {

      }
      this.dataService.setLoading3(true);
      this.dataService.saveRole({
        name: this.roleForm.value.name,
        status: '1'
      }).subscribe((data: any) => {
        if (data.status == 200) {
          this.toaster.success('Role Created Successfully');
          this.submitted = false;
          this.modelService.dismissAll();
          this.roleForm.reset();
          this.roleList();
          this.dataService.resetLoading3(false);
        }
        else if (data.status == 208) {
          this.toaster.error('Role Already Exits');
        }
        else if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }
        else if (data.status == 204) {
          this.toaster.error('No Content');
        }
      })
    }
  }

  buttonText = "Add";
  headingText = 'Add New Role';
  editMode = 0
  openSm(content, element, type: number) {
    if (type === 1) {
      if (this.rolePermission.update == true) {
        this.id = element.id;
        this.companyId = element.companyId;
        this.editMode = 1;
        this.buttonText = "Update";
        this.headingText = "Update Role";
        this.roleForm.patchValue({
          name: "" + element.name,
          status: "" + element.status,
        });
        this.modelService.open(content, { size: 'lg' });
      }
      else {
        this.toaster.error("you don't have permission to access this resource");
      }
    }
    else if (type === 2) {
      if (this.rolePermission.view == true) {
        this.editMode = 2;
        this.headingText = "View Role";
        this.roleForm.patchValue({
          name: "" + element.name,
          status: "" + element.status,
        })
        this.modelService.open(content, { size: 'lg' });
      }
      else {
        this.toaster.error("you don't have permission to access this resource");
      }
    }
    else if (type === 4) {
      if (this.rolePermission.delete == true) {
        this.editMode = 4;
        this.headingText = "Delete Role";
        this.id = element.id;
        this.modelService.open(content, { size: 'lg' });
      }
      else {
        this.toaster.error("you don't have permission to access this resource");
      }
    } else if (type === 0) {
      if (this.rolePermission.insert == true) {
        this.editMode = 0;
        this.headingText = "Add New Role";
        this.buttonText = "Add";
        this.roleForm.patchValue({
          name: "",
          status: ""
        })
        this.modelService.open(content, { size: 'lg' });
      } else {
        this.toaster.error("you don't have permission to access this resource");
      }
    }

  }
  get f() {
    return this.roleForm.controls;
  }
  get f5() {
    return this.deleteForm.controls;

  }
  open(content) {
    this.modelService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
    this.dataService.setLoading3(true);
    this.dataService.updateRole(this.id, this.companyId, {
      name: this.roleForm.value.name
    }).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Role Created Successfully');
        this.submitted = false;
        this.modelService.dismissAll();
        this.roleForm.reset();
        this.roleList();
        this.dataService.resetLoading3(false);
      }
      else if (data.status == 208) {
        this.toaster.error('Role Already Exits');
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
      else if (data.status == 204) {
        this.toaster.error('No Content');
      }
    })
  }
  deleteFromStatus = false
  changeStatus(event: any) {
    this.deleteFromStatus = true
    if (this.deleteForm.value.name === 'DELETE') {
      this.deleteFromStatus = true
    }
    else if (this.deleteForm.value.name) {
      this.deleteFromStatus = false
    }

  }
  delete() {
    this.dataService.setLoading3(true);
    this.dataService.deleteRole(this.id).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Role Deleted Successfully');
        this.modelService.dismissAll();
        this.deleteForm.reset();
        this.roleList();
        this.dataService.resetLoading3(false);
      }
      else if (data.status == 404) {
        this.toaster.error('No Content');
      }
      else if (data.status == 500) {
        this.toaster.error('Can’t be deleted, dependency detected');
      }
    })
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    if (event.previousContainer.id === event.container.id) {
      this.dataService.updateRolePosition(event.container.data).subscribe(data => {
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
  rolePermissionLocat() {
    if (this.roleHashPermission.view == true) {
      this.router.navigate(['/role-master']);
    }
    else {
      this.toaster.error("you don't have permission to access this resource");
    }

  }
}
