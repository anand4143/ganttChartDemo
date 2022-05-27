import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-upgrade-plan-price',
  templateUrl: './upgrade-plan-price.component.html',
  styleUrls: ['./upgrade-plan-price.component.scss']
})
export class UpgradePlanPriceComponent implements OnInit {
  planList: any;
  checked = false;
  showAnuual = false;
  pToken: any;
  totalPrice: any;
  planType: any; 
  planPrice: any;
  packageId = 0;
  companyToken: any;
  exitsPlanRecord: any;
  errMessage = '';
  constructor(private dataService: DataService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router) {
    this.companyToken = localStorage.getItem('companyToken');
    this.dataService.setHome(false);
    this.pToken = localStorage.getItem('pToken');
    this.planType = localStorage.getItem('planPrice');
    this.packageId = parseInt(localStorage.getItem('packageId'));
    this.dataService.getPlanList().subscribe(results => {
      if (results.status == 200) {
        this.exitsPlanRecord = results.data;
        if (this.exitsPlanRecord.id == 1) {
          this.errMessage = "You are currently under <b>"+ this.exitsPlanRecord.package.packageName + "</b> plan, you can renew or upgrade your plan!"
        }
        else {
         
          this.errMessage =  "You are currently under <b>"+ this.exitsPlanRecord.package.packageName + "</b> plan, you can renew or upgrade your plan!"
        }
      }
    })
    if (this.planType == 'planPage' && this.packageId > 0) {
      if (this.showAnuual == false) {
        this.planType = 'M';
        localStorage.setItem("planType", 'M');
        this.dataService.setpackageType('M');
      }
      else {
        this.dataService.setpackageType('Y');
        this.planType = 'Y';
        localStorage.setItem("planType", 'Y');
      }
      this.router.navigate(['/order-summary']);
    }
    // this.dataService.setHome(true);
    if (this.showAnuual == false) {
      this.planType = 'M';
    }
    this.dataService.activepackages().subscribe(data => {
      if (data.status === 200) {
        this.planList = data.data;
      }
      if (data.status === 404) {
        this.toastr.error('No Record Plan');
      }
      if (data.status === 500) {
        this.toastr.error('Unable To Process');
      }
    })
    this.dataService.resetHome(false);
    this.dataService.setLogin(true);
  }

  ngOnInit(): void {
    this.dataService.setHome(true);
  }

  purchasePlan(data: any) {
    if (this.pToken) {
      localStorage.setItem('planPrice', 'planPage');
      localStorage.setItem('packageId', data.id);
      localStorage.setItem('packageName', data.packageName);
      this.totalPrice = parseFloat(data?.userMonthlyPrice) + parseFloat(data?.ontimeSetupFees);
      if (this.totalPrice > 0) {
        this.dataService.setPackage(data.id);
        this.router.navigate(["/order-summary"]);
        localStorage.setItem('packageId', data.id);
        if (this.showAnuual == false) {
          this.planType = 'M';
          localStorage.setItem("planType", 'M');
          this.dataService.setpackageType('M');
        }
        else {
          this.dataService.setpackageType('Y');
          this.planType = 'Y';
          localStorage.setItem("planType", 'Y');
        }
      }

    }
    else if (this.companyToken) {
      this.router.navigateByUrl('/signup');
      localStorage.setItem('planPrice', 'planPage');
      localStorage.setItem('packageId', data.id);
      localStorage.setItem('packageName', data.packageName);
      this.totalPrice = parseFloat(data?.userMonthlyPrice) + parseFloat(data?.ontimeSetupFees);
      if (this.totalPrice > 0) {
        this.dataService.setPackage(data.id);
        this.router.navigate(["/order-summary"]);
        localStorage.setItem('packageId', data.id);
        if (this.showAnuual == false) {
          this.planType = 'M';
          localStorage.setItem("planType", 'M');
          this.dataService.setpackageType('M');
        }
        else {
          this.dataService.setpackageType('Y');
          this.planType = 'Y';
          localStorage.setItem("planType", 'Y');
        }
      }
    }
    else if (!this.companyToken) {
      this.router.navigateByUrl('/signup');
    }
    else if (!this.pToken) {
      this.router.navigateByUrl('/signup');
    }


  }
  changePackage(e: any, value) {
    if (e.target.checked == false) {
      this.showAnuual = false;
      this.planType = 'M';
      localStorage.setItem('planType', 'M');
      this.dataService.setpackageType('M');
    }
    else if (e.target.checked == true) {
      this.showAnuual = true;
      this.planType = 'Y';
      localStorage.setItem('planType', 'Y');
      this.dataService.setpackageType('Y');

    }
  }
}
