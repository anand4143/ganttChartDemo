import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-fail',
  templateUrl: './fail.component.html',
  styleUrls: ['./fail.component.scss']
})
export class FailComponent implements OnInit {

  constructor(private router: Router, private dataService:DataService) { 
    this.dataService.setHome(true);
  }

  ngOnInit(): void {
    this.dataService.setHome(true);
  }
  backHome() {
    this.router.navigate(['/'])
  }

}
