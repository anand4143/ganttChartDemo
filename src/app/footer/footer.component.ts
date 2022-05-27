import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerSetting: any;
  imgUrl: any;

  constructor(private footerService: DataService) {
    this.footerService.footerSiteSeeting().subscribe(data => {
      if (data.status == 200) {
        this.footerSetting = data.data;
        this.imgUrl = environment.apiUrl + this.footerSetting.siteLogo;
        localStorage.setItem('footerCopyRight', this.footerSetting?.footerCopyRight)
      }
    })
  }

  ngOnInit(): void {
  }

}
