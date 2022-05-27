import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgotPassword: FormGroup;
  submitted = false;
  constructor(private dataSerivce: DataService, private router: Router,
    private toaster: ToastrService, private fb: FormBuilder) {
    this.forgotPassword = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    })
    this.dataSerivce.resetHome(true);
    this.dataSerivce.setLogin(false);
  }
  get f() { return this.forgotPassword.controls; }
  ngOnInit(): void {
  }
  onSubmit() {
    this.submitted = true;
    if (this.forgotPassword.invalid) {
      console.table(this.forgotPassword.value);
      return
    }
    if (this.forgotPassword.valid) {
      console.table(this.forgotPassword.value);
    }
    this.dataSerivce.employeeForgetPassword(this.forgotPassword.value.email).subscribe(data => {
      if (data.status == 200) {
        this.router.navigateByUrl('/login');
        this.toaster.success("Password reset link has been sent to your email");
      }
      else if (data.status == 404) {
        this.toaster.error("Invalid email address & not found four account");
      }
    })
  }
}
