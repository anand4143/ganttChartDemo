import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  url = 'https://65.0.30.89/sample-page/'
  constructor() {
    this.url
  }

  ngOnInit(): void {
  }

}
