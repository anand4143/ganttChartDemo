import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';
import { MustMatch } from '../service/mustMatchValidtor';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  signUpForm: FormGroup;
  submitted = false;
  status: boolean = false;
  timeZone: any = [];
  companyNameExitsError: any;
  emailExitsError: any;
  userNameExitsError: any;
  mobileNumberExitsError: any;
  domainNameExitsError: any;
  url: any;
  signUp = false;
  footerCopyRight: any;
  footerSetting: any;
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  public filteredList5: any;

  constructor(private dataService: DataService, private fb: FormBuilder,
    private taster: ToastrService, private router: Router) {
    localStorage.clear();
    this.signUpForm = this.fb.group({
      companyName: ['', [Validators.required]],
      userName: ['', [Validators.required, this.noWhitespaceValidator]],
      domainName: ['', [Validators.required, this.noWhitespaceValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      timeZone: ['', [Validators.required]],
      termCondition: [false]
    }, {
      validator: MustMatch("password", "confirmPassword")
    });
    this.dataService.setHome(true);
    this.dataService.setLogin(false);
    this.dataService.timeZoneList().subscribe(data => {
      if (data.status == 200) {
        this.timeZone = data.data;
        this.filteredList5= this.timeZone.slice();
      }
      else if (data.status == 404) {
    
      }
      else if (data.status == 500) {
        this.taster.error('Unable To Process ,please try again later');
      }
    })
    this.dataService.footerSiteSeeting().subscribe(data => {
      if (data.status == 200) {
        this.footerSetting = data.data;

      }
    })

  }

  ngOnInit(): void {
  }
  get f() {
    return this.signUpForm.controls;
  }
  onSubmit() {
    //console.table(this.signUpForm.value);
    this.submitted = true;
    if (this.signUpForm.invalid) {
      //console.table(this.signUpForm.value);
      return
    }
    if (this.signUpForm.valid) {
      //console.table(this.signUpForm.value);
    }
    this.dataService.companySingUp({
      name: this.signUpForm.value.companyName,
      userName: this.signUpForm.value.userName.replace(/\s/g, ''),
      password: this.signUpForm.value.password,
      domain: this.signUpForm.value.domainName.replace(/\s/g, ''),
      email: this.signUpForm.value.email,
      mobileNumber: this.signUpForm.value.mobileNumber?.internationalNumber,
      timeZone: this.signUpForm.value.timeZone?.id,
      // address: this.signUpForm.value.address,
    }).subscribe((data: any) => {
      if (data?.status == 200) {
        this.router.navigateByUrl('/plan-price');
        localStorage.setItem("pToken", data.resp);
        this.dataService.setPayToken(data.resp);
        this.taster.success('Company Registered Successfully');
      }
      if (data?.status == 208) {
        this.taster.error('Username Already Exists');
      }
      if (data?.status == 204) {
        this.taster.error('Fiels Is Empty');
      }
      if (data?.status == 500) {
        this.taster.success('Unable To Process');
      }
    })
  }

  check() {
    if (this.signUpForm.value.companyName) {

      this.dataService.checkDuplicate({ name: this.signUpForm.value.companyName }).subscribe(data => {
        if (data.status == 209) {
          this.companyNameExitsError = 'Company Name Already Exists'
        }
        if (data.status == 404) {
          this.companyNameExitsError = '';
        }
      });
    }
    if (this.signUpForm.value.userName) {

      this.dataService.checkDuplicate({ userName: this.signUpForm.value.userName }).subscribe(data => {
        if (data.status == 208) {
          this.userNameExitsError = 'Username Already Exists';
        }
        if (data.status == 404) {
          this.userNameExitsError = '';
        }
      });
    }
    if (this.signUpForm.value.domainName) {
      this.dataService.checkDuplicate({ domain: this.signUpForm.value.domainName }).subscribe(data => {
        if (data.status == 212) {
          this.domainNameExitsError = 'Domain Already Registered';
        }
        if (data.status == 404) {
          this.domainNameExitsError = '';
        }
      });
    }
    if (this.signUpForm.value.email) {
      this.dataService.checkDuplicate({ email: this.signUpForm.value.email }).subscribe(data => {
        if (data.status == 210) {
          this.emailExitsError = 'Email Id  Already Exists';
        }
        if (data.status == 404) {
          this.emailExitsError = '';
        }
      });
    }
    if (this.signUpForm.value.mobileNumber) {
      this.dataService.checkDuplicate({ mobileNumber: this.signUpForm.value.mobileNumber?.number }).subscribe(data => {
        if (data.status == 211) {
          this.mobileNumberExitsError = 'Mobile Number  Already Exists';
        }
        if (data.status == 404) {
          this.mobileNumberExitsError = '';
        }
      });
    }
  }

  keyDown(e) {
    var e = window.event || e;
    var key = e.keyCode;
    //space pressed
    if (key == 32) { //space
      e.preventDefault();
    }
  }

  checkWhitespace(event) {
    var data = event.clipboardData.getData("text/plain");
    var isNullOrContainsWhitespace = (!data || data.length === 0 || /\s/g.test(data));

    if (isNullOrContainsWhitespace) {
      event.preventDefault();
    }
  }
}


