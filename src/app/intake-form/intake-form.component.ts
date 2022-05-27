import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-intake-form',
  templateUrl: './intake-form.component.html',
  styleUrls: ['./intake-form.component.scss']
})
export class IntakeFormComponent implements OnInit {

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.setHome(true);
  }

}
