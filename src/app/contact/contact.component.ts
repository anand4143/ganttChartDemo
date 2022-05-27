import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  categaoryList = [{
    value: "REQUEST TECH SUPPORT CALL BACK",
  }, {
    value: "EMAIL TECH SUPPORT ",
  }, {
    value: "BILLING QUERY",
  }, {
    value: "CAREERS",
  }, {
    value: "MEDIA",
  },{
    value: "PARTNERSHIPS",
  },{
    value: "SOMETHING ELSE",
  }]
  mobileNoError: any
  constructor(private dataService: DataService, private fb: FormBuilder, private toaster: ToastrService) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', [Validators.required]],
      categoryType: ['', [Validators.required]],
      description: ['', [Validators.required]],
      MobileNo: [''],
      recaptchaReactive: ['',[Validators.required]]
    })
  }

  get f() { return this.contactForm.controls; }
  ngOnInit(): void {
    this.dataService.setHome(true);
  }
  check() {
    if (parseInt(this.contactForm.value.MobileNo?.length) > 0) {
      this.contactForm.controls['MobileNo'].setValidators([Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]);
    } else {
      this.contactForm.controls['MobileNo'].clearValidators();
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      console.table(this.contactForm.value);
      return
    }
    if (this.contactForm.valid) {
      console.table(this.contactForm.value);
    }
    if (parseInt(this.contactForm.value.MobileNo.length) > 1) {
      this.contactForm.controls['MobileNo'].setValidators([Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]);
    } else {
    
      this.contactForm.controls['MobileNo'].clearValidators();

    }
    this.dataService.contactForm({
      firstName: this.contactForm.value.firstName,
      lastName: this.contactForm.value.lastName,
      email: this.contactForm.value.email,
      MobileNo: this.contactForm.value.MobileNo?.internationalNumber,
      companyName: this.contactForm.value.companyName,
      categoryType: this.contactForm.value.categoryType,
      description: this.contactForm.value.description,
    }).subscribe(data => {
      if (data.status == 200) {
        this.contactForm.patchValue({
          firstName: '',
          lastName: '',
          email: '',
          MobileNo: '',
          companyName: '',
          categoryType: '',
          description: '',
        })
        this.contactForm.reset();
        this.submitted = false;
        this.toaster.success('Thank you for contacting us, one of our team members will get in touch shortly!');
      }
      if (data.status == 500) {
        this.toaster.success('Unable to Process, please check your internate connecation ...');
      }
    })

  }
  async resolved(captchaResponse: string) {
    await this.sendTokenToBackend(captchaResponse);
  }
  sendTokenToBackend(tok) {
    //calling the service and passing the token to the service
    this.dataService.sendToken(
      { recaptcha: tok }).subscribe(
        data => {
     
        },
        err => {
     
        },
        () => { }
      );
  }

}
