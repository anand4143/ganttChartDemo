import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  constructor(private dataService:DataService) { 
    this.dataService.setHome(true);
  }

  ngOnInit(): void {
    this.dataService.setHome(true);
  }

}
