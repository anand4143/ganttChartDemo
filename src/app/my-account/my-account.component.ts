import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';
import { MustMatch } from '../service/mustMatchValidtor';
import jwt_decode from 'jwt-decode';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  changePasswordForm: FormGroup;
  updateProfileForm: FormGroup;
  submitted = false;
  submit = false;
  id: any;
  textBoxStatus = false;
  employeeRecord: any;
  imgUrl: any;
  selectedFiles?: FileList;
  currentFile?: File;
  packageDetail: any;
  emolyeeCount: any;
  planExpired: any;
  editMode = 0;
  status = false;
  opened = false;
  closeResult: any;
  viewRecord: any;
  deleteForm: FormGroup;
  loginToken: any;
  decoded: any;
  roleId: any;
  systemPermission: any;
  companyBranding: FormGroup;
  permissions: any;
  html = false;
  brandLogo: any;
  siteRecord: any;
  faviConIcon: any;
  companyId: any;
  constructor(private fb: FormBuilder, private toaster: ToastrService, private router: Router,
    private modelService: NgbModal,
    private spinner: NgxSpinnerService, private dataService: DataService, private titleService: Title) {
    this.deleteForm = this.fb.group({
      name: ['', Validators.required]
    })
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      currentPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: MustMatch("newPassword", "confirmPassword")
    });
    this.dataService.planExpiredOrNot().subscribe(data => {
      if (data.status == 200) {
        // this.router.navigate(["/dashboard"]);
      }
      else if (data.status == 402) {
        this.router.navigate(['/UpgradePlanPrice'])
      }
    })
    this.updateProfileForm = this.fb.group({
      name: ['', Validators.required],
      companyName: ['', Validators.required],
      mobileNo: ['', Validators.required],
      email: ['', Validators.required],
      country: ['', Validators.required],
      location: ['', Validators.required]
    });
    this.companyBranding = this.fb.group({
      title: ['', Validators.required],
      siteLogo: ['', Validators.required],
      faviIcon: ['', Validators.required],
    })

    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'compnaySiteSetting') {
            this.systemPermission = element;
            if (this.systemPermission.view == true) {
              this.html = true;
            }
            // else {
            //   this.toaster.error("you don't have permission to perform this action");
            // }
          }
        });
      }
      if (results.status == 404) {
        this.systemPermission = results.data;
        if (this.systemPermission.view == false) {
          this.html = false
          // this.toaster.error("you don't have permission to access this resource");
        }

      }
    })
    const token: any = localStorage.getItem('token');
    const companyToken: any = localStorage.getItem('companyToken');
    const empToken: any = localStorage.getItem('empToken');
    const pToken: any = localStorage.getItem('pToken');

    if (token) {
      this.loginToken = token
    }
    if (companyToken) {
      this.loginToken = companyToken
    }
    if (pToken) {
      this.loginToken = pToken
    }
    if (empToken) {
      this.loginToken = empToken
    }
    this.decoded = jwt_decode(this.loginToken);
    this.roleId = this.decoded.roleId;

    this.dataService.resetHome(false);
    this.getProfileUser();
    this.dataService.getPlanList().subscribe(data => {
      if (data.status == 200) {
        this.packageDetail = data.data;
        this.emolyeeCount = data.userCount;
        this.planExpired = data.planExpried;
      }
      if (data.status == 404) {
        this.toaster.error('You have not subscribed to any plan');
      }
      if (data.status == 500) {
        this.toaster.error('Unable to process');
      }
    })
    let obj = localStorage.getItem('menuStatus');
    if (obj == 'true') {
      this.status = true
      this.opened = true
    }
    else {
      this.opened = false
      this.status = false
    }
    this.dataService.getSiteSetting().subscribe(data => {
      if (data.status == 200) {
        this.siteRecord = data.data;
        this.companyBranding.patchValue({
          title: "" + this.siteRecord.title,
          siteLogo: "" + this.siteRecord.siteLogo,
          faviIcon: "" + this.siteRecord.faviIcon
        })

        this.companyId = this.siteRecord.id;
        this.faviConIcon = environment.apiUrl + this.siteRecord.faviIcon;
        this.brandLogo = environment.apiUrl + this.siteRecord.siteLogo;
      }
      if (data.status == 404) {
        // this.toaster.error('No Record Found');
      }
    })
  };
  get f4() {
    return this.companyBranding.controls;
  }
  getProfileUser() {
    this.dataService.getProfile().subscribe(data => {
      this.dataService.setLoading3(true);
      if (data.status == 200) {
        this.employeeRecord = data.data;
        this.id = data.data.id;
        this.imgUrl = environment.apiUrl + data.data.profilePic;
        this.updateProfileForm.patchValue({
          name: data.data.name,
          email: data.data.email,
          companyName: data.data.companyName,
          country: data.data.country,
          location: data.data.location,
          mobileNo: data.data.mobileNo,
        })
        this.dataService.resetLoading3(false);
      }
    });
  }
  transaction() {
    this.router.navigate(['/transaction']);
  }
  ngOnInit(): void {
  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }

  changePassword() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      //console.table(this.changePasswordForm.value);
      return
    }
    if (this.changePasswordForm.valid) {
      //console.table(this.changePasswordForm.value);
    }
    this.dataService.setLoading3(true);
    this.dataService.employeeChangePassword({
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    }, this.id).subscribe(data => {

      if (data.status == 200) {
        this.toaster.success('Password changed successfully!');
        this.changePasswordForm.patchValue({
          newPassword: +"",
          currentPassword: + "",
          confirmPassword: + ""
        })
        this.changePasswordForm.reset();
        this.router.navigateByUrl('/login');
        this.dataService.logout();
        this.dataService.resetLoading3(false);
      }
      if (data.status == 304) {
        this.toaster.error('Unable to process at the moment');
      }
      if (data.status == 401) {
        this.toaster.error('Invalid current password');
      }
      if (data.status == 404) {
        this.toaster.error('No Content');
      }
      if (data.status == 500) {
        this.toaster.error('Unable to process at the moment');
      }
      this.changePasswordForm.reset();
    })
  }
  get f() {
    return this.changePasswordForm.controls;
  }
  get f1() {
    return this.updateProfileForm.controls;
  }
  onSubmit() {
    this.submit = true;
    if (this.updateProfileForm.invalid) {
      return
    }
    if (this.updateProfileForm.valid) {

    }
    this.dataService.updateEmployee(this.id, {
      name: this.updateProfileForm.value.name,
      email: this.updateProfileForm.value.email,
      country: this.updateProfileForm.value.country,
      location: this.updateProfileForm.value.location,
      mobileNo: this.updateProfileForm.value.mobileNo?.number
    }).subscribe((data: any) => {
      if (data.status == 200) {
        this.getProfileUser();
        this.toaster.success('Updated successfully');
      }
      if (data.status == 404) {
        this.toaster.error('No Content');
      }
      if (data.status == 304) {
        this.toaster.error('Cannot update information');
      }
      if (data.status == 500) {
        this.toaster.error('Unable To process');
      }
    })
  }
  profileUplaod(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = event.target.files;
      const formData = new FormData();
      formData.append('file', this.selectedFiles.item(0));
      formData.append('user', 'userId');
      formData.append('fmcid', 'fmcid');
      this.dataService.updateEmployeeProfile(this.id, this.selectedFiles.item(0)).subscribe((data: any) => {
        if (data.status == 200) {
          this.imgUrl = environment.apiUrl + data.data;
          this.toaster.success('Profile pic uploaded successfully');
        }
        if (data.status == 204) {
          this.toaster.error('No Content');
        }
        if (data.status == 500) {
          this.toaster.error('Unable to process');
        }
      });
    }
  }


  openDelete(content, element) {
    this.deleteForm.patchValue({
      name: ""
    })
    this.modelService.open(content, { size: 'md' });
  }
  open(content) {
    this.modelService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  handleDOBChange(e: any) {
    this.textBoxStatus = false;
    this.dataService.updateGoal(this.id, {
      endDate: this.deleteForm.value.endDate
    }).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Deleted successfully');
      }
      else if (data.status == 208) {
        this.toaster.error('No content');
      }
      else if (data.status == 304) {
        this.toaster.error('Not modified');
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }

  get f5() {
    return this.deleteForm.controls;
  }
  delete() {
    this.dataService.deleteCompnay().subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('Deleted successfully');
        this.router.navigateByUrl('/');
      }
      else if (data.status == 404) {
        // this.toaster.error('No Record Found');
      }
      else if (data.status == 304) {
        this.toaster.error('Not modified');
      }
      else if (data.status == 500) {
        this.toaster.error('Unable to process');
      }
    })
  }
  deleteFromStatus = false
  changeStatus(event: any) {
    this.deleteFromStatus = true
    if (this.deleteForm.value.name === 'DELETE') {
      this.deleteFromStatus = true
    }
    else if (this.deleteForm.value.name) {
      this.deleteFromStatus = false
    }

  }
  UploadLogo(event: any) {
    if (this.systemPermission.update == true) {
      if (event.target.files.length > 0) {
        this.selectedFiles = event.target.files;
        this.dataService.uploadSiteLogo(this.companyId, this.selectedFiles.item(0)).subscribe((data: any) => {
          if (data.status == 200) {
            this.companyBranding.patchValue({
              siteLogo: "" + data.data
            })
            this.brandLogo = environment.apiUrl + data.data;
            this.toaster.success('Logo uploaded successfully');
          }
          if (data.status == 204) {
            this.toaster.error('No content');
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

  UploadFavicon(event: any) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);

        if (width !== 32 && height !== 32) {
          this.toaster.error("photo should be 32 x 32 size")
        }
        else {
          if (this.systemPermission.update == true) {
            if (event.target.files.length > 0) {
              this.selectedFiles = event.target.files;
              this.dataService.updateFavicon(this.companyId, this.selectedFiles.item(0)).subscribe((data: any) => {
                if (data.status == 200) {
                  this.companyBranding.patchValue({
                    faviIcon: "" + data.data
                  })
                  this.dataService.changeHeaderSetting('changeLogo');
                  this.faviConIcon = environment.apiUrl + data.data;
                  this.toaster.success('Logo uploaded successfully');
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
        // this.companyBranding.patchValue({
        //   faviIcon: "" + reader.result
        // })
      };
    }

  }
  submiting = false;
  updateBradning() {
    this.submiting = true;
    if (this.companyBranding.invalid) {
      //console.table(this.companyBranding.value);
      return
    }
    if (this.companyBranding.valid) {
      //console.table(this.companyBranding.value);
    }
    this.dataService.updateSiteSetting(this.companyId, {
      title: this.companyBranding.value.title,
      siteLogo: this.companyBranding.value.siteLogo,
      faviIcon: this.companyBranding.value.faviIcon
    }).subscribe((data: any) => {
      if (data.status == 200) {
        this.dataService.changeHeaderSetting('changeLogo');
        this.getProfileUser();
        this.toaster.success('Updated successfully');
      }
      if (data.status == 404) {
        this.toaster.error('No Content');
      }
      if (data.status == 304) {
        this.toaster.error('Cannot update information');
      }
      if (data.status == 500) {
        this.toaster.error('Unable To process');
      }
    })
  }
  upGreadPlan() {
    this.router.navigate(['/UpgradePlanPrice'])
  }
}
