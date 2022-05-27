import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

// declare var paypal;
@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  @ViewChild('paypal') paypalElement: ElementRef;
  planId: any;
  subcripId: any;
  basicAuth: any;
  orderPackage: any;
  id: any;
  showAnuual = false;
  planType: any;
  totalPrice: any;
  tokenId: any;
  type: any;
  openCheckBox = false;
  coupenForm: FormGroup;
  submitted = false;
  parcentage = 0;
  processingFees: any;
  discountAmount: any;
  coupenRecord: any;
  discountCoin: number = 0.0;
  feesProcessing: number = 0.0;
  hideShow = false;
  editMode = 0;
  successMessage: any;
  failMessage: any;
  planExits: any;
  constructor(private dataService: DataService, private fb: FormBuilder, private titleService: Title, private toaster: ToastrService, private router: Router) {
    this.coupenForm = this.fb.group({
      coupen: ['', Validators.required],
      totalAmount: ['', Validators.required],
      processingFees: ['', Validators.required],
    });
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title)
    this.dataService.siteSetting().subscribe(results => {
      if (results.status == 200) {
        this.processingFees = results.data;
        this.coupenForm.patchValue({
          processingFees: this.processingFees.processingFees
        })
      }
      if (results.status == 500) {
        this.toaster.error('site setting not found');
      }
    })
    this.dataService.getPlanList().subscribe(results => {

      if (results.status == 200) {
        this.planExits = results.data
      }

    })
    this.dataService.packageId.subscribe(data => {
      if (data.length > 0) {
        this.id = data;
      } else {
        this.id = localStorage.getItem('packageId');
      }
      this.dataService.setHome(true);
      if (this.id > 0) {
        this.dataService.getPackageById(this.id).subscribe(data => {
          if (data.status == 200) {
            this.dataService.siteSetting().subscribe(results => {
              if (results.status == 200) {
                this.processingFees = results.data;
                this.coupenForm.patchValue({
                  processingFees: this.processingFees.processingFees
                })
              }
            })
            this.orderPackage = data.data;
            this.dataService.packageType.subscribe(async results => {
              if (results.length > 0) {
                if (results == 'M') {
                  this.type = 'M';
                  this.showAnuual = false;
                  if (this.planExits?.transactionAmount > 0) {
                    this.totalPrice = parseFloat(this.orderPackage?.userMonthlyPrice);
                    this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                    let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                    this.coupenForm.patchValue({
                      totalAmount: parseFloat(acutalAmount)
                    })
                  }
                  else {
                    this.totalPrice = parseFloat(this.orderPackage?.userMonthlyPrice) + parseFloat(this.orderPackage?.ontimeSetupFees);

                    this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                    let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                    this.coupenForm.patchValue({
                      totalAmount: parseFloat(acutalAmount)
                    })
                  }

                }
                else if (results == 'Y') {
                  this.type = 'Y';
                  this.showAnuual = true;
                  if (this.planExits?.transactionAmount > 0) {
                    this.totalPrice = parseFloat(this.orderPackage?.annualPrice);

                    this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                    let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                    this.coupenForm.patchValue({
                      totalAmount: parseFloat(acutalAmount)
                    })
                  }
                  else {
                    this.totalPrice = parseFloat(this.orderPackage?.annualPrice) + parseFloat(this.orderPackage?.ontimeSetupFees);
                    this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees?.processingFees);
                    let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                    this.coupenForm.patchValue({
                      totalAmount: parseFloat(acutalAmount)
                    })
                  }

                }
              }
              else {
                this.dataService.siteSetting().subscribe(results => {
                  if (results.status == 200) {
                    this.processingFees = results.data;
                    this.coupenForm.patchValue({
                      processingFees: this.processingFees.processingFees
                    })
                  }
                })
                if (this.planType == 'M') {
                  this.showAnuual = false;
                  this.type = 'M';
                  if (this.planExits?.transactionAmount > 0) {
                    this.totalPrice = parseFloat(this.orderPackage?.userMonthlyPrice);
                    this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees?.processingFees);
                    let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2);
                    this.coupenForm.patchValue({
                      totalAmount: parseFloat(acutalAmount)
                    })
                  }
                  else {
                    this.totalPrice = parseFloat(this.orderPackage?.userMonthlyPrice) + parseFloat(this.orderPackage?.ontimeSetupFees);
                    this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees?.processingFees);
                    let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2);
                    this.coupenForm.patchValue({
                      totalAmount: parseFloat(acutalAmount)
                    })
                  }

                }
                else if (this.planType == 'Y') {
                  this.showAnuual = true;
                  this.type = 'Y';
                  if (this.planExits.packageId > 0) {
                    this.totalPrice = parseFloat(this.orderPackage?.annualPrice);
                    this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees?.processingFees);
                    let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                    this.coupenForm.patchValue({
                      totalAmount: parseFloat(acutalAmount)
                    })
                  }
                  else {
                    this.totalPrice = parseFloat(this.orderPackage?.annualPrice) + parseFloat(this.orderPackage?.ontimeSetupFees);
                    this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees?.processingFees);
                    let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                    this.coupenForm.patchValue({
                      totalAmount: parseFloat(acutalAmount)
                    })
                  }

                }
              }
            })
            this.dataService.getPaymentId(this.id, this.type).subscribe(data => {
              const type = this.type
              if (data.status == 200) {
                this.package = data.package;
                this.totalAmount = data.totalAmount;
                this.payPalConfig = {
                  currency: 'USD',
                  clientId: 'ARC2pdXDZdMv0LcX2MlIqtAEjeIXCSUrWlmeiJVM_piFnF08GFY6nb1a9qMXxTr7ZF5q89RDVkAtewrk',
                  createOrderOnClient: (data) => <ICreateOrderRequest>{
                    intent: 'CAPTURE',
                    purchase_units: [{
                      amount: {
                        currency_code: 'USD',
                        value: this.coupenForm.value.totalAmount,
                        breakdown: {
                          item_total: {
                            currency_code: 'USD',
                            value: this.coupenForm.value.totalAmount
                          }
                        }
                      },
                      items: [{
                        name: this.package.packageName,
                        quantity: '1',
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                          currency_code: 'USD',
                          value: this.coupenForm.value.totalAmount
                        },
                      }]
                    }]
                  },
                  advanced: {
                    commit: 'true'
                  },
                  style: {
                    label: 'paypal',
                    layout: 'vertical'
                  },
                  onApprove: (data, actions) => {
                    this.toaster.success('Transaction successfully');
                    actions.order.get().then(details => {
                    });
                  },
                  onClientAuthorization: (data: any) => {
                    if (data.status == "COMPLETED") {
                      this.dataService.paymentDone({
                        packageId: this.package.id,
                        orderId: data.id,
                        paymentId: data.payer.payer_id,
                        paymentResponse: data.status,
                        transactionDetail: JSON.stringify(data),
                        type: type,
                        coupen: this.coupenForm.value.coupen
                      }).subscribe(data => {
                        this.router.navigate(['/success']);
                      })
                    }
                    this.showSuccess = true;
                  },
                  onCancel: (data, actions) => {
                    this.showCancel = true;
                    this.router.navigate(['/fail']);
                  },
                  onError: err => {
                    this.showError = true;
                  },
                  onClick: (data, actions) => {
                    this.resetStatus();
                  }
                };
              }
              else if (data.status == 404) {
                this.toaster.error('Transaction cannot create');
              }
              else if (data.status == 500) {
                this.toaster.error('Unable to process');
              }
            })
          }

          else if (data.status == 404) {
            // this.toaster.error('No Record Found')
          }
          else if (data.status == 500) {
            this.toaster.error('Unable to process please try again later')
          }
        })
      }
      else {
        this.router.navigate(['/plan-price'])
      }
    })
  }

  ngOnInit(): void {
    this.planType = localStorage.getItem('planType');
  }
  showSuccess: any;
  showCancel: any;
  showError: any;
  resetStatus() {

  }
  package: any;
  totalAmount: any;
  initConfig(): void {


  }
  coupenBox(event: any) {
    if (event.target.checked == true) {
      this.openCheckBox = true;
    }
    if (event.target.checked == false) {
      this.openCheckBox = false;
      this.reset();
    }
  }

  // 
  onFocusOutEvent(e: any) {
    this.submitted = true
    if (this.coupenForm.invalid) {
      //console.table(this.coupenForm.value);
      return
    }
    if (this.coupenForm.valid) {
      //console.table(this.coupenForm.value);
    }
    this.dataService.checkCoupen(this.coupenForm.value.coupen).subscribe(data => {
      this.editMode = 1;
      if (data.status == 200) {
        this.coupenRecord = data.data;
        if (this.coupenRecord.type == 'Flat') {
          this.discountAmount = this.totalAmount - parseFloat(this.coupenRecord.coins);
          this.discountCoin = this.coupenRecord.coins;
          this.totalAmount = this.discountAmount;
          this.feesProcessing = this.totalAmount / 100 * parseFloat(this.coupenForm.value.processingFees);
          let acutalAmount = parseFloat(this.totalAmount + this.feesProcessing).toFixed(2)
          this.coupenForm.patchValue({
            totalAmount: parseFloat(acutalAmount)
          })
          this.failMessage = '';
          this.successMessage = "coupon applied!"
        }
        if (this.coupenRecord.type == 'Percentage') {
          this.discountAmount = this.totalAmount / 100 * parseFloat(this.coupenRecord.coins);
          this.discountCoin = this.discountAmount;
          this.totalAmount = this.totalAmount - this.discountAmount;
          this.feesProcessing = this.totalAmount / 100 * parseFloat(this.coupenForm.value.processingFees);
          let acutalAmount = parseFloat(this.totalAmount + this.feesProcessing).toFixed(2)
          this.coupenForm.patchValue({
            totalAmount: parseFloat(acutalAmount)
          })
          this.successMessage = "Promo Code applied!";
        }
      }
      if (data.status == 404) {
        this.successMessage = '';
        this.failMessage = '';
        this.failMessage = "Promo Code invalid!";
        this.toaster.error("Invalid Promo Code");
      }
      if (data.status == 500) {
        this.toaster.error("Unable To Process, please try again later");
      }

    })
  }
  get f() {
    return this.coupenForm.controls;
  }

  reset() {
    if (this.id > 0) {
      this.failMessage = '';
      this.successMessage = '';
      this.editMode = 0;
      this.discountCoin = 0;

      this.dataService.getPackageById(this.id).subscribe(data => {
        if (data.status == 200) {
          this.orderPackage = data.data;
          this.dataService.packageType.subscribe(async results => {
            if (results.length > 0) {
              if (results == 'M') {
                this.type = 'M';
                this.showAnuual = false;
                if (this.planExits?.transactionAmount > 0) {
                  this.totalPrice = parseFloat(this.orderPackage?.userMonthlyPrice);
                  this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                  let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                  this.coupenForm.patchValue({
                    totalAmount: parseFloat(acutalAmount)
                  })
                }
                else {
                  this.totalPrice = parseFloat(this.orderPackage?.userMonthlyPrice) + parseFloat(this.orderPackage?.ontimeSetupFees);

                  this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                  let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                  this.coupenForm.patchValue({
                    totalAmount: parseFloat(acutalAmount)
                  })
                }

              }
              else if (results == 'Y') {
                this.type = 'Y';
                this.showAnuual = true;
                if (this.planExits.transactionAmount > 0) {
                  this.totalPrice = parseFloat(this.orderPackage?.annualPrice);

                  this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                  let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                  this.coupenForm.patchValue({
                    totalAmount: parseFloat(acutalAmount)
                  })
                }
                else {
                  this.totalPrice = parseFloat(this.orderPackage?.annualPrice) + parseFloat(this.orderPackage?.ontimeSetupFees);
                  this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                  let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                  this.coupenForm.patchValue({
                    totalAmount: parseFloat(acutalAmount)
                  })
                }

              }
            }
            else {

              if (this.planType == 'M') {
                this.showAnuual = false;
                this.type = 'M';
                if (this.planExits?.transactionAmount > 0) {
                  this.totalPrice = parseFloat(this.orderPackage?.userMonthlyPrice);
                  this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                  let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2);
                  this.coupenForm.patchValue({
                    totalAmount: parseFloat(acutalAmount)
                  })
                }
                else {
                  this.totalPrice = parseFloat(this.orderPackage?.userMonthlyPrice) + parseFloat(this.orderPackage?.ontimeSetupFees);
                  this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                  let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2);
                  this.coupenForm.patchValue({
                    totalAmount: parseFloat(acutalAmount)
                  })
                }

              }
              else if (this.planType == 'Y') {
                this.showAnuual = true;
                this.type = 'Y';
                if (this.planExits.packageId > 0) {
                  this.totalPrice = parseFloat(this.orderPackage?.annualPrice);
                  this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                  let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                  this.coupenForm.patchValue({
                    totalAmount: parseFloat(acutalAmount)
                  })
                }
                else {
                  this.totalPrice = parseFloat(this.orderPackage?.annualPrice) + parseFloat(this.orderPackage?.ontimeSetupFees);
                  this.feesProcessing = parseFloat(this.totalPrice) / 100 * parseFloat(this.processingFees.processingFees);
                  let acutalAmount = parseFloat(this.totalPrice + this.feesProcessing).toFixed(2)
                  this.coupenForm.patchValue({
                    totalAmount: parseFloat(acutalAmount)
                  })
                }

              }
            }
          })
          this.dataService.getPaymentId(this.id, this.type).subscribe(data => {
            const type = this.type
            if (data.status == 200) {
              this.package = data.package;
              this.totalAmount = data.totalAmount;
              this.payPalConfig = {
                currency: 'USD',
                clientId: 'ARC2pdXDZdMv0LcX2MlIqtAEjeIXCSUrWlmeiJVM_piFnF08GFY6nb1a9qMXxTr7ZF5q89RDVkAtewrk',
                createOrderOnClient: (data) => <ICreateOrderRequest>{
                  intent: 'CAPTURE',
                  purchase_units: [{
                    amount: {
                      currency_code: 'USD',
                      value: this.coupenForm.value.totalAmount,
                      breakdown: {
                        item_total: {
                          currency_code: 'USD',
                          value: this.coupenForm.value.totalAmount
                        }
                      }
                    },
                    items: [{
                      name: this.package.packageName,
                      quantity: '1',
                      category: 'DIGITAL_GOODS',
                      unit_amount: {
                        currency_code: 'USD',
                        value: this.coupenForm.value.totalAmount
                      },
                    }]
                  }]
                },
                advanced: {
                  commit: 'true'
                },
                style: {
                  label: 'paypal',
                  layout: 'vertical'
                },
                onApprove: (data, actions) => {
                  this.toaster.success('Transaction successfully');
                  actions.order.get().then(details => {
                  });
                },
                onClientAuthorization: (data: any) => {
                  if (data.status == "COMPLETED") {
                    this.dataService.paymentDone({
                      packageId: this.package.id,
                      orderId: data.id,
                      paymentId: data.payer.payer_id,
                      paymentResponse: data.status,
                      transactionDetail: JSON.stringify(data),
                      type: type,
                      coupen: this.coupenForm.value.coupen
                    }).subscribe(data => {
                      this.router.navigate(['/success']);
                    })
                  }
                  this.showSuccess = true;
                },
                onCancel: (data, actions) => {
                  this.showCancel = true;
                  this.router.navigate(['/fail']);
                },
                onError: err => {
                  this.showError = true;
                },
                onClick: (data, actions) => {
                  this.resetStatus();
                }
              };
            }
            else if (data.status == 404) {
              this.toaster.error('Transaction cannot create');
            }
            else if (data.status == 500) {
              this.toaster.error('Unable to process');
            }
          })
        }

        else if (data.status == 404) {
          // this.toaster.error('No Record Found')
        }
        else if (data.status == 500) {
          this.toaster.error('Unable to process please try again later')
        }
      })
      this.coupenForm.patchValue({
        coupen: ''
      })
    }
  }
}