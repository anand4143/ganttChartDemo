import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';
// import { Location } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  token: any;
  url: any;
  urlString: any;
  imgUrl: any;
  domainExits: any;
  domainRecord: any;
  signUp = false;
  footerSetting: any
  constructor(private fb: FormBuilder, private dataService: DataService, private activatedRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    localStorage.clear();
    this.token = localStorage.getItem('companyToken');
    if (this.token) {
      this.router.navigate(["/dashboard"]);
    }
    this.dataService.footerSiteSeeting().subscribe(data => {
      if (data.status == 200) {
        this.footerSetting = data.data;
        this.imgUrl = environment.apiUrl + this.footerSetting.siteLogo;
        localStorage.setItem('footerCopyRight', this.footerSetting?.footerCopyRight)
      }
    })
    this.url = window.location.hostname;
    this.dataService.setHome(true);
    this.dataService.setLogin(true);
    const subdomain = this.url.split('.');
    const orogincalUrl = subdomain[0];
    if (orogincalUrl == 'localhost') {
      this.signUp = true;
    }
    else if (orogincalUrl == 'lyllilaunchtools') {
      this.signUp = true;
    }
    else {
      this.dataService.checkSubDomain(orogincalUrl).subscribe((results: any) => {
        if (results.status == 200) {
          this.domainExits = results.domain;
          this.dataService.loginBrandig(this.domainExits.domain, this.domainExits.id).subscribe(data => {
            if (data.status == 200) {
              this.domainRecord = data.data;
              this.imgUrl = environment.apiUrl + this.domainRecord.siteLogo;
            }
          })
          localStorage.setItem('subdomain', orogincalUrl);
          this.router.navigate(['/login']);
        }
        if (results.status == 404) {
          this.router.navigate(['/not-found']);
        }
        if (results.status == 500) {
          this.toaster.error('Unable To Process, Please check your internet connecation');
        }

      })
    }

  }
  ngOnInit(): void {

  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    if (this.loginForm.invalid) {
  
    }
    this.dataService.employeeLogin({
      userName: this.loginForm.value.userName,
      password: this.loginForm.value.password,
    }).subscribe(loginResp => {
      if (loginResp.status == 200) {
        localStorage.setItem('companyToken', loginResp.token);
        this.dataService.getCompanyTransaction().subscribe(response => {
          if (response.status == 200) {
            this.dataService.resetHome(false);
            localStorage.setItem('login', 'true');
            this.dataService.setLogin(true);
            this.dataService.planExpiredOrNot().subscribe(data => {
              if (data.status == 200) {
                this.dataService.getDomain(loginResp.token).subscribe((results: any) => {
                  if (results.status == 200) {
                    this.toaster.success("Login Successfully");
                    this.domainExits = results.data;
                    this.url = window.location.hostname;
                    const subdomain = this.url.split('.');
                    const orogincalUrl = subdomain[0];
                    if (orogincalUrl == this.domainExits.domain) {
                      this.router.navigate(['/dashboard/' + loginResp.token]);
                    }
                    else {
                      this.router.navigate(['/dashboard/' + loginResp.token]);
                      // window.location.replace("https://" + this.domainExits.domain + ".lyllilaunchtools.com/dashboard/" + loginResp.token);
                    }

                    // location.replace("http://localhost:4200/dashboard/" + loginResp.token);

                  }
                  if (results.status == 404) {
                    this.router.navigate(['/not-found']);
                  }
                  if (results.status == 500) {
                    this.toaster.error('Unable To Process, Please check your internet connecation');
                  }

                })
              }
              else if (data.status == 402) {
                this.router.navigate(['/UpgradePlanPrice'])
              }
            })
          }
          else if (response.status == 404) {
            this.router.navigate(["/plan-price"]);
            this.toaster.error("Purchase subscription plan");

          }
          else if (response.status == 500) {
            this.toaster.error("Unable To  Process");
          }
        })

      }
      if (loginResp.status == 404) {
        this.toaster.error("UserName Not Found");
      }
      if (loginResp.status == 401) {
        this.toaster.error("Invalid Password");
      }
      if (loginResp.status == 500) {
        this.toaster.error("Unable To  Process");
      }
    });

  }
}
