import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-d-header',
  templateUrl: './d-header.component.html',
  styleUrls: ['./d-header.component.scss']
})
export class DHeaderComponent implements OnInit {
  selectedResion = 'option2';
  employeeRecord: any;
  imgUrl: any;
  regionRecord: any;
  projectRecod: any;
  workSteamRecord: any;
  month: any;
  projectId: any;
  lastLogin: any;
  time = new Date();
  intervalId;
  token: any;
  login = false;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  noification: any;
  siteRecord: any;
  dashboardToken: any;
  interVal: any;
  constructor(private dataService: DataService, private titleService: Title, private router: Router, private toaster: ToastrService, private datePipe: DatePipe) {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.dataService.loginToken.subscribe(record => {
      if (record) {
        this.dataService.getProfileByToken(record).subscribe(data => {
          if (data.status == 200) {
            this.employeeRecord = data.data;
            this.setDocTitle(this.employeeRecord?.title);
            this.imgUrl = environment.apiUrl + this.employeeRecord?.profilePic;
            this.lastLogin = this.employeeRecord?.lastLogin;
          }
          if (data.status == 404) {
            // this.toaster.error('No Record Found');
          }
          if (data.status == 500) {
            // this.toaster.error('Unable To Process');
          }
          this.month = "N/A";
        })
      }


    })


    setTimeout(() => {
      this.getProfileUser();
      //   /** spinner ends after 20 seconds */
      // this.dataService.notificationCount().subscribe(results => {
      //   if (results.status == 200) {
      //     this.noification = results.data[0] || 0
      //   }
      // })
      this.dataService.getRegion().subscribe(results => {
        if (results.status == 200) {
          this.regionRecord = results.data;
          this.selectedResion = this.regionRecord[0].name || 'region';
        }
        if (results.status == 404) {
          // this.toaster.error('No Record Found');
        }
        if (results.status == 500) {
          // this.toaster.error('Unable To Process');
        }
      })
      const token: any = localStorage.getItem('token');
      const companyToken: any = localStorage.getItem('companyToken');
      const empToken: any = localStorage.getItem('empToken');
      const pToken: any = localStorage.getItem('ptoken');
      if (token) {
        this.token = token;
      }
      if (pToken) {
        this.token = pToken;
      }
      if (companyToken) {
        this.token = companyToken;
      }
      if (empToken) {
        this.token = empToken;
      }
      this.dataService.offlineOnline({ status: 1 }).subscribe(data => {
        console.log(this.token == '')
        if (data.status == 200) {

        }
        else {

        }
    
      })
      if (this.token) {
        this.interVal = setInterval(() => {
          this.dataService.notificationCount().subscribe(results => {
            if (results.status == 200) {
              this.noification = results.data[0] || 0
            }
          })
        }, 30000)
      };
    }, 5000);

    if (this.token) {


    }
    this.dataService.getSiteSetting().subscribe(data => {
      if (data.status == 200) {
        this.siteRecord = data?.data;
        this.favIcon.href = environment.apiUrl + this.siteRecord?.faviIcon;
      }
    })
    this.dataService.changeHeader.subscribe(resData => {
      if (resData) {
        this.dataService.getSiteSetting().subscribe(data => {
          if (data.status == 200) {
            this.siteRecord = data?.data;
            this.favIcon.href = environment.apiUrl + this.siteRecord?.faviIcon;
          }
        })
      }
      this.dataService.notificationCount().subscribe(results => {
        if (results.status == 200) {
          this.noification = results.data[0] || 0;
        }
      })
      this.getProfileUser();
    })
    this.dataService.loginToken.subscribe(record => {
      this.dashboardToken = record

    })
    if (this.dashboardToken) {
      localStorage.setItem('token', this.dashboardToken);
    }
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);

    if (this.token) {
      this.login = true;
      this.getProfileUser();
      //region list
      this.dataService.getRegion().subscribe(results => {
        if (results.status == 200) {
          this.regionRecord = results.data;
          this.selectedResion = this.regionRecord[0].name || 'region';
        }
        if (results.status == 404) {
          // this.toaster.error('No Record Found');
        }
        if (results.status == 500) {
          // this.toaster.error('Unable To Process');
        }
      })
      this.dataService.notificationCount().subscribe(results => {
        if (results.status == 200) {
          this.noification = results.data[0] || 0;
        }
      })
    }
    else {
      // this.router.navigate(['/']);
    }

  }
  getProfileUser() {
    this.dataService.getProfile().subscribe(data => {
      if (data.status == 200) {
        this.employeeRecord = data.data;
        this.setDocTitle(this.employeeRecord?.title);


        this.imgUrl = environment.apiUrl + this.employeeRecord?.profilePic;
        this.lastLogin = this.employeeRecord?.lastLogin;
      }
      if (data.status == 404) {
        // this.toaster.error('No Record Found');
      }
      if (data.status == 500) {
        // this.toaster.error('Unable To Process');
      }
      this.month = "N/A";
    })

  }
  setDocTitle(title: string) {
    this.titleService.setTitle(title);
  }
  ngOnInit(): void {
    if (this.token) {
    }
    else {
      // this.router.navigateByUrl('/');
    }
  }
  //logout
  logOut() {
    this.dataService.offlineOnline({ status: 0 }).subscribe(data => {
      clearInterval(this.interVal);
    })
    this.login = false;
    this.dataService.resetLogin(false);
    this.dataService.logout();
    this.dataService.resetHome(false);
    this.router.navigate(['/login']);
 
  }
  selected: any
  //change region
  selectRegions() {
    // if (this.token) {
    this.dataService.getProjectListRegion(this.selected).subscribe(data => {
      if (data.status == 200) {
        this.projectRecod = data.data;
        this.month = "N/A"
      }
      if (data.status == 404) {
        // this.toaster.error('No Record Found');
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process, please try again later');
      }
    })
    // }
  }
  selectWorkStreamId: any
  //select work astram id and get record by project
  selectWorkStream(workStearm: any) {
    // if (this.token) {
    this.dataService.getGoalLast(this.selectWorkStreamId, this.projectId).subscribe(data => {
      if (data.status == 200) {
        let record = data.data;
        let date1: any = new Date(this.datePipe.transform(record[0].startDate, 'MM/dd/yyyy', 'en-US'));
        let date2: any = new Date(this.datePipe.transform(record[0].date, 'MM/dd/yyyy', 'en-US'));
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.month = Math.floor(diffDays / 30);
      }
      if (data.status == 404) {
        // this.toaster.error('No Record Found');
      }
      if (data.status == 500) {
        // this.toaster.error('Unable To Process');
      }
    })
    // }
  }
  projectRecord: [];
  selectProject(project: any) {
    if (this.token) {
      this.projectId = this.projectRecord;
      this.dataService.getProject(this.projectRecord).subscribe(data => {
        let record = data.data;
        let date1: any = new Date(this.datePipe.transform(record[0].startDate, 'MM/dd/yyyy', 'en-US'));
        let date2: any = new Date(this.datePipe.transform(record[0].endDate, 'MM/dd/yyyy', 'en-US'));
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.month = Math.floor(diffDays / 30);
        this.workSteamRecord = record[0].workStream;
      })

    }
  }


}
