import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';
import { MustMatch } from '../service/mustMatchValidtor';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-forget-change-password',
  templateUrl: './forget-change-password.component.html',
  styleUrls: ['./forget-change-password.component.scss']
})
export class ForgetChangePasswordComponent implements OnInit {
  changePassword: FormGroup;
  token: any;
  submitted = false;
  decoded: any;
  constructor(private data: DataService, private toaster: ToastrService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router) {

    this.changePassword = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: MustMatch("password", "confirmPassword")
    })
    this.route.params.subscribe(params => {
      this.token = params.token;
    });
  }




  get f() { return this.changePassword.controls; }
  ngOnInit(): void {
    this.data.setHome(true);
    this.data.setLogin(true)
  }
  onSubmit() {
    this.submitted = true;
    if (this.changePassword.invalid) {
      //console.table(this.changePassword.value);
      return
    }
    if (this.changePassword.valid) {
      //console.table(this.changePassword.value);
    }
    this.data.employeeChangeForgetPassword(this.token, {password:this.changePassword.value.password}).subscribe(results => {
      if (results.status == 200) {
        this.toaster.success('Password changed successfully');
      }
      else if (results.status == 404) {
        this.toaster.error('Link has been expired, please generate again');
      }
      else if (results.status == 304) {
        this.toaster.error('Unable to process at the moment');
      }
    })
  }
}
