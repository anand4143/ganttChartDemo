import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private dataService:DataService) {
    this.dataService.setHome(true);
  }

  ngOnInit(): void {
    this.dataService.setHome(true);
  }

}
