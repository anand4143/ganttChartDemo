import { Component, OnInit} from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  panelOpenState = false;

  constructor(private dataService:DataService) {
    this.dataService.setHome(true);
  }

  ngOnInit(): void {

  }

  scrollPoint1() {
    document.getElementById('point_1').scrollIntoView();
  }

  scrollPoint2() {
    document.getElementById('point_2').scrollIntoView();
  }

  scrollPoint3() {
    document.getElementById('point_3').scrollIntoView();
  }

  scrollPoint4() {
    document.getElementById('point_4').scrollIntoView();
  }

  scrollPoint5() {
    document.getElementById('point_5').scrollIntoView();
  }

}
