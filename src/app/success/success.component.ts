import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  ptoken: any;
  packageName: any;
  button = false;
  successMessage: any;
  packageId: any;
  constructor(private router: Router, private dataService: DataService, private toaster: ToastrService, private spinner: NgxSpinnerService) {
    this.ptoken = localStorage.getItem('pToken');
    this.dataService.setHome(true);
    this.packageName = localStorage.getItem('packageName');
    this.packageId=localStorage.getItem('packageId')
    if (this.packageId == 1) {
      this.successMessage = "Your " + this.packageName + " ACTIVATED SUCCESSFULLY!"
    }
    else {
      this.successMessage = "Your " + this.packageName + " PLAN ACTIVATED SUCCESSFULLY!"
    }

    this.spinner.show();
    setTimeout(() => {
      this.button = true;
      this.spinner.hide();
    }, 8000);
  };
  domainExits: any;
  ngOnInit(): void {
    this.dataService.setHome(true);
  }
  successRedirection() {
    if (this.ptoken) {
      this.dataService.getDomain(this.ptoken).subscribe((results: any) => {
        if (results.status == 200) {
          localStorage.setItem('login', 'true');

          this.dataService.setLogin(true);
          this.domainExits = results.data;
          window.location.replace("http://" + this.domainExits.domain + ".lyllilaunchtools.com/dashboard/" + this.ptoken);
        }
        if (results.status == 404) {
          this.router.navigate(['/not-found']);
        }
        if (results.status == 500) {
          this.toaster.error('Unable To Process, Please check your internet connecation');
        }
      })
    }
    else {
      this.router.navigate(['/login']);
    }
    // this.dataService.verified().subscribe(data => {
    //   if (data.status == 200) {
    //     this.toaster.error('Please verify your email id');
    //   }
    //   else if (data.status == 404) {
    //     if (this.ptoken) {
    //       this.router.navigate(['/dashboard']);
    //     }
    //     else {
    //       this.router.navigate(['/login']);
    //     }
    //   }
    //   else if (data.status == 500) {
    //     this.router.navigate(['/dashboard']);
    //   }
    // })

  }
}
