import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';
import { SidsortPipe } from '../sidsort.pipe';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  loginTime: any;
  permissionRecord: any;
  newPermission = [];
  siteRecord: any;
  imgUrl: any;
  newSidnave: any
  sidNab = [];
  dashboard: any;
  roleMenu: any
  productsMenu: any;
  workstreamMenu: any;
  regionMenu: any;
  userMenu: any;
  trackMenu: any;
  communicationMenu: any;
  systemMenu: any;
  values: any;
  sideNav = false;
  constructor(private sortPipe: SidsortPipe, private dataService: DataService, private router: Router, private toastr: ToastrService) {
    this.dataService.resetHome(false);
    const token: any = localStorage.getItem('token');
    const companyToken: any = localStorage.getItem('companyToken');
    const empToken: any = localStorage.getItem('empToken');
    const pToken: any = localStorage.getItem('pToken');

    if (token) {
      this.values = token;
    }
    else if (companyToken) {
      this.values = companyToken;
    }
    else if (empToken) {
      this.values = empToken;
    }
    if (pToken) {
      this.values = pToken;
    }
    if (this.values) {
      this.sideNav = true;
      this.sidNavPermissionList();
      this.dataService.getSiteSetting().subscribe(data => {
        if (data.status == 200) {
          this.siteRecord = data.data;
          this.imgUrl = environment.apiUrl + this.siteRecord.siteLogo;
        }
        if (data.status == 404) {
        
        }
      })
      this.dataService.lastLogin().subscribe(data => {
        if (data.status == 200) {
          this.loginTime = data.data
        };
      })
    }
    else {
      this.sideNav = false;
    }



  }


  ngOnInit(): void {
  }
  sidNavPermissionList() {
    this.dataService.listPermisssion().subscribe(data => {
      if (data.status == 200) {
        this.sideNav = true;
        this.permissionRecord = data.data;
        this.permissionRecord.forEach(element => {
          if (element.event == true) {
            this.newPermission.push(...element.permissionRecords);
          }
          this.newPermission.forEach(element => {
            if (element.actionUrl == 'dashboard') {
              this.dashboard = element;
            }
            if (element.actionUrl == 'role-management') {
              this.roleMenu = element;
            }
            if (element.actionUrl == 'products') {
              this.productsMenu = element;
            }
            if (element.actionUrl == 'workstream-management') {
              this.workstreamMenu = element;
            }
            if (element.actionUrl == 'region-management') {
              this.regionMenu = element;
            }
            if (element.actionUrl == 'user-management') {
              this.userMenu = element;
            }
            if (element.actionUrl == 'track-monitor') {
              this.trackMenu = element;
            }
            if (element.actionUrl == 'communication') {
              this.communicationMenu = element;
            }
            if (element.actionUrl == 'system-management') {
              this.systemMenu = element;
            }

          });
          this.newSidnave = this.sortPipe.transform(this.newPermission, "asc", "name");
        });
      }
      else if (data.status == 404) {
     
      }
      else if (data.status == 500) {
        this.toastr.error('Unable to process');
      }

    })
  }

}
