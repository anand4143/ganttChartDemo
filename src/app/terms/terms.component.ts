import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(private dataService:DataService) {
    this.dataService.setHome(true);
  }

  ngOnInit(): void {
    this.dataService.setHome(true);
  }

}
