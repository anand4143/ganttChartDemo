import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  loading: boolean;
  constructor(private spinner: NgxSpinnerService, private dataService: DataService) {
    this.dataService.isLoading.subscribe((v) => {
      this.loading = v;
      if (this.loading == true) {
        this.spinner.show();
        setTimeout(() => {
          /** spinner ends after 20 seconds */
          this.spinner.hide();
        }, 5000);
      }
      if (this.loading == false) {
        this.spinner.hide();
      }
   
    });
  }

  ngOnInit(): void {
    // this.spinner.show();
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
  }

}
