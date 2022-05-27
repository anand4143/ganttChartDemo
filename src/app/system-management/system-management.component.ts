import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-system-management',
  templateUrl: './system-management.component.html',
  styleUrls: ['./system-management.component.scss']
})
export class SystemManagementComponent implements OnInit {
  systemForm: FormGroup;
  siteRecord: any;
  submitted = false;
  imgUrl: any;
  selectedFiles?: FileList;
  currentFile?: File;
  id: any;
  zoneRecord=[];
  status = false;
  opened = false;
  permissions: any;
  systemPermission: any;
  html = false;
  public filteredList5: any;
  constructor(private dataService: DataService,private titleService:Title, private fb: FormBuilder, private toaster: ToastrService, private spinner: NgxSpinnerService, private router: Router) {
    this.systemForm = this.fb.group({
      domain: ['', Validators.required],
      email: ['', Validators.required],
      timeZone: ['', Validators.required]
    });
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);
    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'system-management') {
            this.systemPermission = element;
            if (this.systemPermission.view == true) {
              this.html = true;
            }
            else{
              this.toaster.error("you don't have permission to perform this action");
            }
          }
        });
      }
      if (results.status == 404) {
        this.systemPermission = results.data;
        if (this.systemPermission.view == false) {
          this.html = false;
          this.toaster.error("you don't have permission to access this resource");
        }

      }
    })
    let obj = localStorage.getItem('menuStatus');
    if (obj == 'true') {
      this.status = true;
      this.opened = true;
    }
    else {
      this.opened = false;
      this.status = false;
    }
    this.dataService.resetHome(false);
    this.dataService.getSiteSetting().subscribe(data => {
      if (data.status == 200) {
        this.siteRecord = data.data;
        this.imgUrl = environment.apiUrl + this.siteRecord.siteLogo;
        this.id = this.siteRecord.id;
        this.systemForm.patchValue({
          email: this.siteRecord.email,
          domain: this.siteRecord.domain,
        })
        const toSelect = this.zoneRecord.find(c => c.id == this.siteRecord.timeZone);
        this.systemForm.get('timeZone').setValue(toSelect);
      }
      if (data.status == 404) {
   
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
    this.dataService.timeZoneList().subscribe(data => {
      if (data.status == 200) {
        this.zoneRecord = data.data
        this.filteredList5= this.zoneRecord.slice()
      }
      if (data.status == 404) {
      
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }
  ngOnInit(): void {
  }
  get f() {
    return this.systemForm.controls;
  }
  
  onSubmit() {
    if (this.systemPermission.update == true) {
      this.submitted = true;
      if (this.systemForm.invalid) {
        // console.table(this.systemForm.value);
        return
      }
      if (this.systemForm.valid) {
      
      }
      this.dataService.updateSiteSetting(this.id, {
        email: this.systemForm.value.email,
        domain: this.systemForm.value.domain,
        timeZone: this.systemForm.value.timeZone?.id,
      }).subscribe(data => {
        if (data.status == 200) {
          this.toaster.success('Updated successfully');
        }
        if (data.status == 204) {
          this.toaster.error('No Content');
        }
        if (data.status == 500) {
          this.toaster.error('Unable to process');
        }
      })
    }
    else {
      this.toaster.error("you don't have permission to perform this action");
    }
  }
  UploadLogo(event: any) {
    if (this.systemPermission.update == true) {
      if (event.target.files.length > 0) {
        this.selectedFiles = event.target.files;
        this.dataService.uploadSiteLogo(this.id, this.selectedFiles.item(0)).subscribe((data: any) => {
          if (data.status == 200) {
            this.systemForm.patchValue({
              siteLogo: data.data
            })
            this.imgUrl = environment.apiUrl + data.data;
            this.toaster.success('Logo upload successfully');
          }
          if (data.status == 204) {
            this.toaster.error('No Content');
          }
          if (data.status == 500) {
            this.toaster.error('Unable to process');
          }
        })
      }
    } else {
      this.toaster.error("you don't have permission to perform this action");
    }
  }
}
