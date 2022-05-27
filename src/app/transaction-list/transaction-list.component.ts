import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  transaction: any;
  errMessage: any;
  constructor(private dataService: DataService, private toaster: ToastrService,private titleService:Title) {
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);
    this.dataService.companyTransaction().subscribe(data => {
      if (data.status === 200) {
        this.transaction = data.data;
      }
      else if (data.status == 404) {
        // this.toaster.error('No Record Found!');
        this.errMessage = "No Record Found!";
      }
      else if (data.status == 500) {
        this.toaster.error('Unable To Process, plesae try again later!');
      }
    })
  }

  ngOnInit(): void {

  }


}
