import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ignoreElements } from 'rxjs/operators';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-plan-price',
  templateUrl: './plan-price.component.html',
  styleUrls: ['./plan-price.component.scss']
})
export class PlanPriceComponent implements OnInit {
  planList: any;
  checked = false;
  showAnuual = false;
  pToken: any;
  totalPrice: any;
  planType: any;
  planPrice: any;
  packageId = 0;
  companyToken: any;
  constructor(private dataService: DataService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router) {

    this.companyToken = localStorage.getItem('companyToken');
    this.pToken = localStorage.getItem('pToken');
    this.planType = localStorage.getItem('planPrice');
    this.packageId = parseInt(localStorage.getItem('packageId'));
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
    this.dataService.setHome(true);
    if (this.showAnuual == false) {
      this.planType = 'M';
    }
    this.dataService.getPackage().subscribe(data => {
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
    this.dataService.setLogin(false);
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
      else {
        this.dataService.paymentDone({
          packageId: data.id,
          orderId: data.id,
          paymentId: "B75APK2YZ83RF" + data.id,
          paymentResponse: "COMPLETED",
          transactionDetail: JSON.stringify({ id: data.id, packageName: data.packageName }),
          type: this.planType
        }).subscribe(data => {
          if (data.status == 200) {
            this.toastr.success('Payment Success!');
            this.router.navigate(['/success']);
          }
          else if (data.status == 500) {
            this.toastr.error('Opps ! Something Went Wrong , please try again');
            this.router.navigate(['/fail']);
          }
        })
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
      else {
        this.dataService.paymentDone({
          packageId: data.id,
          orderId: data.id,
          paymentId: "B75APK2YZ83RF" + data.id,
          paymentResponse: "COMPLETED",
          transactionDetail: JSON.stringify({ id: data.id, packageName: data.packageName }),
          type: this.planType
        }).subscribe(data => {
          if (data.status == 200) {
            this.toastr.success('Payment Success !');
            this.router.navigate(['/success']);
          }
          else if (data.status == 500) {
            this.toastr.error('Opps ! Something Went Wrong , please try again');
            this.router.navigate(['/fail']);
          }
        })

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
