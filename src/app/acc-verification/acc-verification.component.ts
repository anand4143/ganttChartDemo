import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-acc-verification',
  templateUrl: './acc-verification.component.html',
  styleUrls: ['./acc-verification.component.scss']
})
export class AccVerificationComponent implements OnInit {
  token: any;
  companyToken: any;
  constructor(private accVerification: DataService, private route: ActivatedRoute, private router: Router, private toaster: ToastrService) {

    this.companyToken = localStorage.getItem('pToken');
    // this.accVerification.setLogin(false);
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
  }
  Verify() {
    this.accVerification.checkLinkValidOrNot({ token: this.token }).subscribe(data => {
      if (data.status == 200) {
        if (this.companyToken) {
          this.router.navigate(['/dashboard']);
        }
        else {
          this.router.navigate(['/login']);
        }
      }
      else if (data.status == 404) {
        this.router.navigate(['/login']);
        this.toaster.error('Verification link has been expired');
      }
    })
  }
  ngOnInit(): void {
    this.accVerification.setHome(true);
    this.accVerification.setLogin(true);
  }

}
