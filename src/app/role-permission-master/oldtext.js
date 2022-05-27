import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-role-permission-master',
  templateUrl: './role-permission-master.component.html',
  styleUrls: ['./role-permission-master.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RolePermissionMasterComponent implements OnInit {
  roleRecord: any;
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
  roleName: any;
  constructor(private dataService: DataService, private toaster: ToastrService, private fb: FormBuilder, private toastr: ToastrService) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      insert: ['', [Validators.required]],
      update: ['', [Validators.required]],
      delete: ['', [Validators.required]],
      view: ['', [Validators.required]],
    });

    // this.getAllPermission();
    this.roleRecordList();
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

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

    this.dataService.permissionList().subscribe(results => {
      if (results.status == 200) {
        this.roleHashPermisssion = results.data;
      }

      else if (results.status == 404) {
        // this.toaster.error('No Record Found');
      }
      else if (results.status == 500) {
        this.toaster.error('Unable To Process Pleas try again later');
      }
    })
    this.dataService.rolesList().subscribe(data => {
      if (data.status == 200) {
        this.roleRecord = data.data
      }
    })


  }
  roleId: any;
  changeRole(e) {
    this.roleId = this.roleForm.value.name
    
    this.dataService.permissionListByRoleId(this.roleId).subscribe(results => {
      if (results.status == 200) {
        this.moduleRecord = results.data;
        this.dataService.listPermisssion().subscribe(results => {
          if (results.status == 200) {
            this.permissionRecord = results.data;
            this.moduleRecord.forEach((element: any) => {
              // this.permissionUrls.push({
              //   permissionId: element.prmissionId,
              //   roleId: element.roleId,
              //   insert: element.insert,
              //   update: element.update,
              //   delete: element.delete,
              //   download: element.download,
              //   view: element.view
              // });
              this.permissionRecord.forEach(ele => {
                if (ele.prmissionId === element.permissionId) {
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
                  else if (element.download == false) {
                    ele.download = false;
                  }
                  else if (element.insert == false) {
                    ele.insert = false;
                  }
                  else if (element.view == false) {
                    ele.view = false;
                  }
                  else if (element.delete == false) {
                    ele.delete = false;
                  }
                  else if (element.update === false) {
                    ele.update = false;
                  }
                }

              })
            });
          }
          else if (results.status == 404) {
            // this.toastr.error('No Record Found');
          }
          else if (results.status == 500) {
            this.toastr.error('Unable to process');
          }

        })
      }
      else if (results.status == 404) {
        // this.toastr.error('No Record Found');
      }
      else if (results.status == 500) {
        this.toastr.error('Unable to process');
      }
    })
    this.dataService.getRoleById(this.roleId).subscribe(responsee => {
      if (responsee.status == 200) {
        this.roleName = responsee.data
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
  //role and permission list
  moduleList: any;
  // checkpermission(type) {
  //   // let newData = this.roleHashPermisssion.filter(per => per.permissionId > localPermissionId && per.roleId > localRoleId);
  //   let flag = false;
  //   if (type === 'insert') {
  //     flag = true;
  //   }
  //   flag = true;
  //   if (type === 'update') {
  //     flag = true;
  //   }
  //   flag = true;
  //   if (type === 'delete') {
  //     flag = true;
  //   }
  //   flag = true;
  //   if (type === 'view') {
  //     flag = true;
  //   }
  //   flag = true;
  //   return flag;
  // }
  checkpermission(type, localPermissionId, localRoleId) {
    let newData = this.roleHashPermisssion.filter(per => per.permissionId > localPermissionId && per.roleId > localRoleId);
    let flag = false;
    if (type === 'insert' && newData.insert) {
      flag = true;
    }
    else {
      flag = true;
    }
    if (type === 'update' && newData.update) {
      flag = true;
    }
    else {
      flag = true;
    }
    if (type === 'delete' && newData.delete) {
      flag = true;
    }
    else {
      flag = true;
    }
    if (type === 'view' && newData.view) {
      flag = true;
    }
    else {
      flag = true;
    }
    return flag;
  }
  roleRecordList() {


  }

  //select tab label value 
    if (event.tab.textLabel == 'Task') {
      this.labelValue = event.tab.textLabel
    }
    else if (event.tab.textLabel == 'Discussion') {
      this.labelValue = event.tab.textLabel
    }
    if (event.tab.textLabel == 'Milestone') {
      this.labelValue = event.tab.textLabel
    }
    if (event.tab.textLabel == 'General Actions') {
      this.labelValue = event.tab.textLabel
    }
    if (event.tab.textLabel == 'File') {
      this.labelValue = event.tab.textLabel
    }
  }
  permssionId: any
  change(event, permissionId,roleId, values) {
    if (permissionId.id) {
      this.permssionId.permissionId.id
    }
    else {
      this.permssionId = permissionId.prmissionId
    }
    
    if (event.checked == true) {

      if (values == 'Write') {
        this.dataService.createPermission({
          permissionId: parseInt(this.permssionId),
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
      if (values == 'Edit') {

        this.dataService.createPermission({
          permissionId: parseInt(this.permssionId),
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

      if (values == 'Delete') {


        this.dataService.createPermission({
          permissionId: parseInt(this.permssionId),
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
      if (values == 'Read') {

        this.dataService.createPermission({
          permissionId: parseInt(this.permssionId),
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

    }

    else {
      if (event.checked == false) {
        if (values == 'Write') {
          this.dataService.createPermission({
            permissionId: permissionId.id,
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
        if (values == 'Edit') {

          this.dataService.createPermission({
            permissionId: permissionId.id,
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

        if (values == 'Delete') {
          this.dataService.createPermission({
            permissionId: permissionId.id,
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
        if (values == 'Read') {
          this.dataService.createPermission({
            permissionId: permissionId.id,
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

      }
    })
  }

}
