import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-msa',
  templateUrl: './msa.component.html',
  styleUrls: ['./msa.component.scss']
})
export class MsaComponent implements OnInit {

  constructor(private dataService:DataService) {
    this.dataService.setHome(true);
  }

  ngOnInit(): void {
    this.dataService.setHome(true);
  }


}
