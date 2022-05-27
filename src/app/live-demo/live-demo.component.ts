import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-live-demo',
  templateUrl: './live-demo.component.html',
  styleUrls: ['./live-demo.component.scss']
})
export class LiveDemoComponent implements OnInit {

  constructor(private dataService:DataService) { 
    this.dataService.setHome(true);
  }

  ngOnInit(): void {
    this.dataService.setHome(true);
  }

}
