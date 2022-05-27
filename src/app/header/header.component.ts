import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DataService } from '../service/data.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  imgUrl: any;
  headerSetting: any;
  favIcon = document.createElement('script');
  constructor(private headerService: DataService, public dialog: MatDialog) {
    this.favIcon.src =''
    this.headerService.footerSiteSeeting().subscribe(data => {
      if (data.status == 200) {
        this.headerSetting = data.data;
        this.imgUrl = environment.apiUrl + this.headerSetting.siteLogo
      }
    })
  }
  // appScript

  OpenliveDemo() {
    this.dialog.open(liveDemoModal);
  }

  ngOnInit(): void {}
  
  logOut() {
    this.headerService.logout()
  }

}

@Component({
  selector: 'live-video-modal',
  templateUrl: 'live-video-modal.html',
})
export class liveDemoModal {}
