import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-loader1',
  templateUrl: './loader1.component.html',
  styleUrls: ['./loader1.component.scss']
})
export class Loader1Component implements OnInit {

  loading: boolean;
  constructor(private spinner: NgxSpinnerService, private dataService: DataService) {
    this.dataService.isLoading1.subscribe((v) => {
      this.loading = v;
      if (this.loading == true) {
        this.spinner.show();
        // setTimeout(() => {
        //   /** spinner ends after 20 seconds */
        //   this.spinner.hide();
        // }, 20000);
      }
      if (this.loading == false) {
        this.spinner.hide();
      }
    });
  }

  ngOnInit(): void {
  }

}
