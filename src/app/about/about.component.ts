import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private dataService:DataService) { 
    this.dataService.setHome(true);
  }

  ngOnInit(): void {
    // this.dataService.setHome(true);
  }

}
