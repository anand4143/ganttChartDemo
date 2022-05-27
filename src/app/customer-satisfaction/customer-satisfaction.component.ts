import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-customer-satisfaction',
  templateUrl: './customer-satisfaction.component.html',
  styleUrls: ['./customer-satisfaction.component.scss']
})
export class CustomerSatisfactionComponent implements OnInit {

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.setHome(true);
  }

}
