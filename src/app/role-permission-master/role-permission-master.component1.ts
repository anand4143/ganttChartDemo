// import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { DataService } from '../service/data.service';

// @Component({
//   selector: 'app-role-permission-master',
//   templateUrl: './role-permission-master.component.html',
//   styleUrls: ['./role-permission-master.component.scss']
// })
// export class RolePermissionMasterComponent implements OnInit {
//   roleRecord: any;
//   labelValue = "General Actions";
//   roleForm: FormGroup;
//   permissionRecord: any;
//   permissionArray = [];
//   opened = false;
//   status = false;
//   roleHashPermisssion: any;
//   permissions: any;
//   myPermission: any;
//   moduleList: any;
//   allModuleRecord = [];
//   constructor(private dataService: DataService, private toaster: ToastrService, private fb: FormBuilder, private toastr: ToastrService) {
 
//     let obj = localStorage.getItem('menuStatus');
//     if (obj == 'true') {
//       this.status = true
//       this.opened = true
//     }
//     else {
//       this.opened = false
//       this.status = false
//     }
//     this.dataService.resetHome(false);
//     this.dataService.myPermisssion().subscribe(results => {
//       if (results.status == 200) {
//         this.permissions = results.data;
//         this.permissions.forEach(element => {
//           if (element.permission.actionUrl == 'role-management') {
//             this.myPermission = element
//           }
//         });
//       }
//       if (results.status == 404) {
//         this.toaster.error("No Permission")
//       }
//     })
//     this.dataService.permissionList().subscribe(results => {
//       if (results.status == 200) {
//         this.roleHashPermisssion = results.data;
//       }
//       else if (results.status == 404) {
//         this.toaster.error('No Record Found');
//       }
//       else if (results.status == 500) {
//         this.toaster.error('Unable To Process Pleas try again later');
//       }
//     })
//     this.dataService.rolesList().subscribe(data => {
//       if (data.status == 200) {
//         this.roleRecord = data.data;
//       }
//       else if (data.status == 404) {
//         this.toaster.error('No Record Found!');
//       }
//       else if (data.status == 500) {
//         this.toaster.error('Unable To Process!');
//       }
//     })
//     this.dataService.listPermisssion().subscribe(data => {
//       if (data.status == 200) {
//         this.moduleList = data.data;
//         this.moduleList.forEach(element => {
//           if (element.event == true) {
//             this.permissionArray.push(...element.permissionRecords)
//           }
//         });
     

//       }

//     })
//   }

//   ngOnInit(): void {
//   }



//   clickEvent() {
//     this.status = !this.status;
//     localStorage.setItem('menuStatus', this.status.toString());
//   }


 
//   checkpermission(type, localPermissionId, localRoleId) {
//     let newData = this.roleHashPermisssion.filter(per => per.permissionId > localPermissionId && per.roleId > localRoleId);
//     let flag = false;
//     if (type === 'insert' && newData?.insert) {
//       flag = true;
//     }
//     if (type === 'update' && newData.update) {
//       flag = true;
//     }
//     if (type === 'delete' && newData.delete) {
//       flag = true;
//     }
//     if (type === 'view' && newData.view) {
//       flag = true;
//     }
//     return flag;
//   }

  
//   //select tab label value 
//   selectedTabValue(event) {

//     if (event.tab.textLabel == 'Task') {
//       this.labelValue = event.tab.textLabel
//     }
//     else if (event.tab.textLabel == 'Discussion') {
//       this.labelValue = event.tab.textLabel
//     }
//     if (event.tab.textLabel == 'Milestone') {
//       this.labelValue = event.tab.textLabel
//     }
//     if (event.tab.textLabel == 'General Actions') {
//       this.labelValue = event.tab.textLabel
//     }
//     if (event.tab.textLabel == 'File') {
//       this.labelValue = event.tab.textLabel
//     }
//   }
//   change(event, permissionId, roleId, values) {
    
//     if (event.checked == true) {

//       let arrayValue;
//       if (values == 'Write') {

//         arrayValue = {
//           permissionId: permissionId,
//           roleId: roleId,
//           insert: true
//         }
//         this.dataService.createPermission({
//           permissionId: permissionId,
//           roleId: roleId,
//           insert: true
//         }).subscribe(data => {
//           if (data.status == 200) {
//             this.toastr.success("Pemission Updated");
//           }
//           else if (data.status == 208) {
//             this.toastr.success("Pemission Updated");
//           }
//           else if (data.status == 500) {
//             this.toastr.success("Pemission Create Successfully");
//           }

//         });
//       }
//       if (values == 'Edit') {
//         arrayValue = {
//           permissionId: permissionId,
//           roleId: roleId,
//           update: true
//         }
//         this.dataService.createPermission({
//           permissionId: permissionId,
//           roleId: roleId,
//           update: true
//         }).subscribe(data => {
//           if (data.status == 200) {
//             this.toastr.success("Pemission Updated");
//           }
//           else if (data.status == 208) {
//             this.toastr.success("Pemission Updated")
//           }
//           else if (data.status == 500) {
//             this.toastr.success("Pemission Create Successfully")
//           }

//         });
//       }

//       if (values == 'Delete') {

//         arrayValue = {
//           permissionId: permissionId,
//           roleId: roleId,
//           delete: true
//         }
//         this.dataService.createPermission({
//           permissionId: permissionId,
//           roleId: roleId,
//           delete: true
//         }).subscribe(data => {
//           if (data.status == 200) {
//             this.toastr.success("Pemission Updated");
//           }
//           else if (data.status == 208) {
//             this.toastr.success("Pemission Updated");
//           }
//           else if (data.status == 500) {
//             this.toastr.success("Pemission Create Successfully")
//           }

//         });

//       }
//       if (values == 'Read') {

//         arrayValue = {
//           permissionId: permissionId,
//           roleId: roleId,
//           view: true
//         }
//         this.dataService.createPermission({
//           permissionId: permissionId,
//           roleId: roleId,
//           view: true,
//         }).subscribe(data => {
//           if (data.status == 200) {
//             this.toastr.success("Pemission Updated");
//           }
//           else if (data.status == 208) {
//             this.toastr.success("Pemission Updated")
//           }
//           else if (data.status == 500) {
//             this.toastr.error("Pemission Create Successfully")
//           }

//         });
//       }

//     }

//     else {
//       if (event.checked == false) {
//         if (values == 'Write') {
//           this.dataService.createPermission({
//             permissionId: permissionId,
//             roleId: roleId,
//             insert: false
//           }).subscribe(data => {
//             if (data.status == 200) {
//               this.toastr.success("Pemission Updated");
//             }
//             else if (data.status == 208) {
//               this.toastr.success("Pemission Updated");
//             }
//             else if (data.status == 500) {
//               this.toastr.success("Pemission Create Successfully");
//             }

//           });
//         }
//         if (values == 'Edit') {

//           this.dataService.createPermission({
//             permissionId: permissionId,
//             roleId: roleId,
//             update: false
//           }).subscribe(data => {
//             if (data.status == 200) {
//               this.toastr.success("Pemission Updated");
//             }
//             else if (data.status == 208) {
//               this.toastr.success("Pemission Updated")
//             }
//             else if (data.status == 500) {
//               this.toastr.success("Pemission Create Successfully")
//             }

//           });
//         }

//         if (values == 'Delete') {
//           this.dataService.createPermission({
//             permissionId: permissionId,
//             roleId: roleId,
//             delete: false
//           }).subscribe(data => {
//             if (data.status == 200) {
//               this.toastr.success("Pemission Updated");
//             }
//             else if (data.status == 208) {
//               this.toastr.success("Pemission Updated");
//             }
//             else if (data.status == 500) {
//               this.toastr.success("Pemission Create Successfully")
//             }

//           });

//         }
//         if (values == 'Read') {
//           this.dataService.createPermission({
//             permissionId: permissionId,
//             roleId: roleId,
//             view: false,
//           }).subscribe(data => {
//             if (data.status == 200) {
//               this.toastr.success("Pemission Updated");
//             }
//             else if (data.status == 208) {
//               this.toastr.success("Pemission Updated")
//             }
//             else if (data.status == 500) {
//               this.toastr.error("Pemission Create Successfully")
//             }

//           });
//         }

//       }
//     }
//   }

// }
