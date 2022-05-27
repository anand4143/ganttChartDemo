import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-resion-management',
  templateUrl: './resion-management.component.html',
  styleUrls: ['./resion-management.component.scss']
})
export class ResionManagementComponent implements OnInit {
  regionRecord = [];
  id: any;
  regionId: any;
  closeResult: string;
  editMode = 0;
  submitted = false;
  regionForm: FormGroup;
  headingText = "Add New Region";
  buttonText = "Create";
  status = false;
  errMessage: any;
  opened = false;
  permissions: any;
  permissionRegion: any;
  html = false;
  constructor(private dataService: DataService,private titleService:Title, private modalService: NgbModal, private fb: FormBuilder, private toaster: ToastrService, private spinner: NgxSpinnerService) {
    this.regionList();
    this.regionForm = this.fb.group({
      name: ['', [Validators.required]],
    });
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
    this.dataService.resetHome(false);
    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'region-management') {
            this.permissionRegion = element
            if (this.permissionRegion.view == true) {
              this.html = true
            }
            else {
              // this.toaster.error("you don't have permission to access this resource");
            }
          }
        });
      }
      if (results.status == 404) {
        this.permissionRegion = results.data;
        if (this.permissionRegion.view == true) {
          this.html = true
        }
        else {
          this.toaster.error("you don't have permission to access this resource");
        }
      }
    })
  }

  ngOnInit(): void {
  }
  numSequence(region: number): Array<number> {
    return Array(region);
  }
  regionList() {
    this.dataService.setLoading3(true);
    this.dataService.getRegion().subscribe(data => {
      if (data.status == 200) {

        this.regionRecord = data.data;
        this.dataService.resetLoading3(false);
      }

      if (data.status == 404) {
        this.dataService.resetLoading3(false);
        this.errMessage = "Start adding your first Region by clicking on “Add New Region” button";
        // this.errMessage = "No Record Found";
      ;
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }

  delete() {
    this.dataService.setLoading3(true);
    this.dataService.deleteRegion(this.regionId).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Deleted Successfully');
        this.regionList();
        this.modalService.dismissAll();
        this.dataService.resetLoading3(false);
      }
      if (data.status == 404) {
      
      }
      if (data.status == 500) {
        this.dataService.resetLoading3(false);
        this.toaster.error('Can’t be deleted, dependency detected');
      }
    })
  }

  onSubmit() {
    if (this.regionId > 0) {
      this.update();
    }
    else {
      this.submitted = false;
      if (this.regionForm.invalid) {
        // console.table(this.regionForm.value);
        return
      }
      if (this.regionForm.valid) {
        // console.table(this.regionForm.value);
      }
      this.dataService.setLoading3(true);
      this.dataService.addRegion({
        name: this.regionForm.value.name,
        status: 1,
      }).subscribe(data => {
        this.regionList();
        if (data.status == 200) {
          this.toaster.success('Region Added Successfully');
          this.submitted = false;
          this.modalService.dismissAll();
          this.regionForm.patchValue({
            name: "",
          });
          this.submitted = false;
          this.dataService.resetLoading3(false);
        }
        if (data.status == 208) {
          this.toaster.error('Region Already Exits');
        }
        if (data.status == 204) {
          this.toaster.error('No Content');
        }
        if (data.status == 500) {
          this.toaster.error('Unable To Process');
        }
      })
    }

  }
  update() {
    this.submitted = false;
    if (this.regionForm.invalid) {
      // console.table(this.regionForm.value);
      return
    }
    if (this.regionForm.valid) {
      // console.table(this.regionForm.value);
    }
    this.dataService.setLoading3(true);
    this.dataService.updateRegion(this.regionId, {
      name: this.regionForm.value.name,
      status: 1,
    }).subscribe(data => {
      this.regionList();
      if (data.status == 200) {
        this.submitted = false;
        this.modalService.dismissAll();
        this.toaster.success('Updated Successfully');
        this.dataService.resetLoading3(false);
      }
      if (data.status == 208) {
        this.toaster.error('Region Already Exits');
      }
      if (data.status == 204) {
        this.toaster.error('No Content');
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })


  }
  openSm(content, element, type: number) {
    if (type === 1) {
      if (this.permissionRegion.update == true) {
        this.status = false
        this.editMode = 1;
        this.buttonText = "Update";
        this.headingText = "Update Region";
        this.regionForm.patchValue({
          name: "" + element.name
        });
        this.modalService.open(content, { size: 'md' });
      } else {
        this.toaster.error("you don't have permission to access this resource");
      }

    }
    else if (type === 2) {
      if (this.permissionRegion.view == true) {
        this.status = false
        this.editMode = 2;
        this.headingText = "View Region";
        this.regionForm.patchValue({
          name: "" + element.name,
        });
        this.modalService.open(content, { size: 'md' });
      }
      else {
        this.toaster.error("you don't have permission to access this resource");
      }
    } else if (type == 0) {
      if (this.permissionRegion.view == true) {
        this.status = true;
        this.editMode = 0;
        this.headingText = "Add New Region";
        this.buttonText = "Create";
        this.regionForm.patchValue({
          name: ""
        });
        this.modalService.open(content, { size: 'md' });
      }
      else {
        this.toaster.error("you don't have permission to access this resource");
      }
    } else if (type == 4) {
      if (this.permissionRegion.delete == true) {
        this.modalService.open(content, { size: 'md' });
      }
      else {
        this.toaster.error("you don't have permission to access this resource");
      }
    }
    this.regionId = element.id;

  }
  get f() {
    return this.regionForm.controls;
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
      this.dataService.updateRegionPosition(event.container.data).subscribe(data => {
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
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }
}
