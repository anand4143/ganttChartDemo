import { C, E } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-role-permission-master',
  templateUrl: './role-permission-master.component.html',
  styleUrls: ['./role-permission-master.component.scss'],
})
export class RolePermissionMasterComponent implements OnInit {
  roleRecord = [];
  labelValue = "General Actions";
  roleForm: FormGroup;
  permissionRecord: any;
  permissionArray = [];
  opened = false;
  status = false;
  roleHashPermisssion: any;
  permissions: any;
  myPermission: any;
  allModuleRecord = [];
  moduleRecord: any;
  permissionUrls = [];
  moduleList: any;
  roleName: any;
  roleSelected = false;
  constructor(private dataService: DataService, private titleService:Title,private toaster: ToastrService, private fb: FormBuilder, private toastr: ToastrService) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      insert: ['', [Validators.required]],
      update: ['', [Validators.required]],
      delete: ['', [Validators.required]],
      view: ['', [Validators.required]],
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
    this.dataService.resetHome(false);
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataService.rolesList().subscribe(data => {
      if (data.status == 200) {
        this.roleRecord = data.data;

      }
      else if (data.status == 404) {
        // this.toaster.error('No Record Found!');
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process!');
      }
    })

    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'role-management') {
            this.myPermission = element
            
          }
        });
      }
      if (results.status == 404) {
        this.toaster.error("No Permission")
      }
    })
  }
  roleId: any;
  changeRole() {
    this.roleSelected = true;
    this.roleId = this.roleForm.value.name;
    this.dataService.getRoleById(this.roleId).subscribe(data => {
      if (data.status == 200) {
        this.roleName = data.data
      }
    })

    this.dataService.permissionListByRoleId(this.roleId).subscribe(results => {
      if (results.status == 200) {
        this.moduleRecord = results.data;
        this.dataService.listPermisssion().subscribe(results => {
          if (results.status == 200) {
            this.permissionRecord = results.data;
            this.moduleRecord.forEach((element: any) => {
              this.permissionUrls.push({
                permissionId: element.permissionId,
                roleId: element.roleId,
                insert: element.insert,
                update: element.update,
                delete: element.delete,
                download: element.download,
                view: element.view
              });
              this.permissionRecord.forEach(ele => {
                ele.permissionRecords.forEach(element => {
                  ele.id = element.id;
                });
                if (ele.id === element.permissionId) {
                  if (element.insert == true) {
                    ele.insert = true;
                  }
                  if (element.update == true) {
                    ele.update = true;
                  }
                  if (element.delete === true) {
                    ele.delete = true;
                  }
                  if (element.view == true) {
                    ele.view = true;
                  }
                  if (element.download == true) {
                    ele.download = true;
                  }
                  else if (element.download == 'null') {
                    ele.download = false;
                  }
                  else if (element.insert == 'null') {
                    ele.insert = false;
                  }
                  else if (element.view == 'null') {
                    ele.view = false;
                  }
                  else if (element.delete == 'null') {
                    ele.delete = false;
                  }
                  else if (element.update === 'null') {
                    ele.update = false;
                  }
                }
              })
            });
          }
          else if (results.status == 404) {
          
          }
          else if (results.status == 500) {
            this.toastr.error('Unable to process');
          }

        })
      }
      else if (results.status == 404) {
   
      }
      else if (results.status == 500) {
        this.toastr.error('Unable to process');
      }
    })
  }

  get f() {
    return this.roleForm.controls;
  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }
  inserted = true;
  updated = true;
  views = true;
  deleted = true;
  change(event, permissionId, values) {
    let roleId = this.roleId;
    let permission = 0;
    if (permissionId.prmissionId) {
      permission = permissionId.prmissionId
    }
    if (permissionId.id) {
      permission = permissionId.id
    }
    if (event == true) {
      if (values == 'Write') {
        if (this.myPermission.insert == true) {
          this.dataService.createPermission({
            permissionId: permission,
            roleId: roleId,
            insert: true
          }).subscribe(data => {

            if (data.status == 200) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 208) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 500) {
              this.toastr.success("Pemission Create Successfully");
            }
          });
        }
        else {
          this.changeRole();
          this.inserted = false;
          this.toaster.error("you don't have permission to access this resource");
        }
      }

      if (values == 'Edit') {
        if (this.myPermission.update == true) {
          this.dataService.createPermission({
            permissionId: permission,
            roleId: roleId,
            update: true
          }).subscribe(data => {
            if (data.status == 200) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 208) {
              this.toastr.success("Pemission Updated")
            }
            else if (data.status == 500) {
              this.toastr.success("Pemission Create Successfully")
            }
          });
        }
        else {
          this.changeRole();
          this.updated = false;
          this.toaster.error("you don't have permission to access this resource");
        }
      }
      if (values == 'Delete') {
        if (this.myPermission.update == true) {
          this.dataService.createPermission({
            permissionId: permission,
            roleId: roleId,
            delete: true
          }).subscribe(data => {
            if (data.status == 200) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 208) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 500) {
              this.toastr.success("Pemission Create Successfully")
            }
          });
        }
        else {
          this.changeRole();
          this.deleted = false;
          this.toaster.error("you don't have permission to access this resource");
        }
      }
      if (values == 'Read') {
        if (this.myPermission.view == true) {
          this.dataService.createPermission({
            permissionId: permission,
            roleId: roleId,
            view: true,
          }).subscribe(data => {
            if (data.status == 200) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 208) {
              this.toastr.success("Pemission Updated")
            }
            else if (data.status == 500) {
              this.toastr.error("Pemission Create Successfully")
            }
          });
        }
        else {
          this.changeRole();
          this.views = false;
          this.toaster.error("you don't have permission to access this resource");
        }
      }
    }



    if (event == false) {
      if (values == 'Write') {
        if (this.myPermission.insert == true) {
          this.dataService.createPermission({
            permissionId: permission,
            roleId: roleId,
            insert: false
          }).subscribe(data => {
            if (data.status == 200) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 208) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 500) {
              this.toastr.success("Pemission Create Successfully");
            }
          });
        }
        else {
          this.changeRole();
          this.inserted = false;
          this.toaster.error("you don't have permission to access this resource");
        }
      }

      if (values == 'Edit') {
        if (this.myPermission.update == true) {
          this.dataService.createPermission({
            permissionId: permission,
            roleId: roleId,
            update: false
          }).subscribe(data => {
            if (data.status == 200) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 208) {
              this.toastr.success("Pemission Updated")
            }
            else if (data.status == 500) {
              this.toastr.success("Pemission Create Successfully")
            }
          });
        }
        else {
          this.changeRole();
          this.updated = false;
          this.toaster.error("you don't have permission to access this resource");
        }
      }
      if (values == 'Delete') {
        if (this.myPermission.update == true) {
          this.dataService.createPermission({
            permissionId: permission,
            roleId: roleId,
            delete: false
          }).subscribe(data => {
            if (data.status == 200) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 208) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 500) {
              this.toastr.success("Pemission Create Successfully")
            }
          });
        }
        else {
          this.changeRole();
          this.deleted = false;
          this.toaster.error("you don't have permission to access this resource");
        }
      }
      if (values == 'Read') {
        if (this.myPermission.view == true) {
          this.dataService.createPermission({
            permissionId: permission,
            roleId: roleId,
            view: false,
          }).subscribe(data => {
            if (data.status == 200) {
              this.toastr.success("Pemission Updated");
            }
            else if (data.status == 208) {
              this.toastr.success("Pemission Updated")
            }
            else if (data.status == 500) {
              this.toastr.error("Pemission Create Successfully")
            }
          });
        }
        else {
          this.changeRole();
          this.views = false;
          this.toaster.error("you don't have permission to access this resource");
        }
      }
    }
  }

}