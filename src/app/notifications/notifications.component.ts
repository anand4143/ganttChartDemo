import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notification: any;
  totaldata: any;
  errMessage: any;
  recordNotify: any;
  deleteForm: FormGroup;
  opened = false;
  status = false;
  constructor(private dataService: DataService, private modelService: NgbModal, private fb: FormBuilder,
    private spinner: NgxSpinnerService, private toaster: ToastrService, private router: Router, private titleService: Title) {
    this.notificationList(this.pageNo, this.pageLimit);
    this.deleteForm = this.fb.group({
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
    this.titleService.setTitle(title)
    this.dataService.resetHome(false);
  }

  ngOnInit(): void {
  }

  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }
  pageNo = 1;
  pageLimit = 20;
  notificationList(pageNo, pageLimit) {
    this.dataService.notifications({
      page: pageNo,
      limit: pageLimit,

    }).subscribe(data => {
      if (data.status == 200) {
        this.notification = data.data
        this.totaldata = data?.count;
        this.notification.forEach(element => {
          element.employee.forEach(element1 => {
            element.profilePic = environment.apiUrl + element1?.profilePic;
            element.name = element1.name;
          });
        });
      }
      if (data.status == 404) {
        this.errMessage = "No Record Found";
      }
      if (data.status == 500) {
        this.errMessage = "Unable To Process";
      }
    })
  }

  delete() {
    this.dataService.deletNnotifications(this.id).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Deleted Successfully');
        this.modelService.dismissAll();
        this.notificationList(this.pageNo, this.pageLimit);
      }
      if (data.status == 404) {
        // this.toaster.error('No record Found');
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  closeResult: any;
  id: any;
  deleteFromStatus = false
  get f() {
    return this.deleteForm.controls;
  }
  openDelete(content, element) {
    this.id = element.id
    this.modelService.open(content, { size: 'lg' });
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
  changeStatus(event: any) {
    this.deleteFromStatus = true
    if (this.deleteForm.value.name === 'DELETE') {
      this.deleteFromStatus = true
    }
    else if (this.deleteForm.value.name) {
      this.deleteFromStatus = false
    }

  }

  readAllNotification() {
    this.dataService.readAllNotification({ status: 1 }).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Notifications marked as read');
        this.dataService.changeHeaderSetting('changeNofication')
        this.notificationList(this.pageNo, this.pageLimit)
      }
      if (data.status == 404) {
        // this.toaster.success('No Record Found');
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process, please try again later')
      }
    })
  }

  pageEvents(event) {
    this.notificationList(event.pageIndex, event.pageSize,);
  }
}
