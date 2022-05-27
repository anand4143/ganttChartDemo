import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { DataService } from '../service/data.service';
// import { Location } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  clientsSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoWidth: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 2000,
    autoplaySpeed: 3000,
    slideTransition: 'linear',
    navSpeed: 700,
    navText: ['Previous', 'Next'],
    responsive: {
      0: {
        items: 2,
        loop: true,
      },
      400: {
        items: 3,
        loop: true,
      },
      740: {
        items: 4,
        loop: true,
      },
      940: {
        items: 5,
        loop: true,
      }
    },
    nav: false
  }

  testimonialSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 2000,
    dotsSpeed: 2000,
    autoplaySpeed: 1000,
    autoplay: true,
    autoplayTimeout: 5000,
    navText: ['Previous', 'Next'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }

  @ViewChild('carouselHolder', { static: false }) carouselHolder: ElementRef;
  isCarouselmatdrawerVisible = false;

  ngAfterViewChecked() {
    this.showCarousel();
  }

  showCarousel(): void {
    if (this.carouselHolder.nativeElement.clientWidth > 0 && !this.isCarouselmatdrawerVisible) {
      setTimeout(() => {
        this.isCarouselmatdrawerVisible = true;
      }, 0);
    }
  }

  login = false;
  url: any;
  packageList: any;
  domainRecord: any;
  domainExits: any;
  constructor(private dataService: DataService, private router: Router, private toaster: ToastrService) {
    this.dataService.setHome(true);
    this.dataService.loginStatus.subscribe((v) => {
      this.login = v;
      if (v == true) {
        this.login = true;
      }
      else if (v == false) {
        this.login = false;
      }
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          this.login = false;
        } else {
          this.login = true;
        }
      }
    });

    this.dataService.getPackage().subscribe(data => {
      if (data.status == 200) {
        this.packageList = data.data
      }
    })
    this.url = window.location.hostname;


    const subdomain = this.url.split('.');
    const orogincalUrl = subdomain[0];
    if (orogincalUrl == 'localhost') {
      // this.router.navigate(['/']);
    }
    else if (orogincalUrl == 'lyllilaunchtools') {
      // this.router.navigate(['/']);
    }
    else {
      this.dataService.checkSubDomain(orogincalUrl).subscribe((results: any) => {
        if (results.status == 200) {
          this.domainExits = results.domain;
          this.dataService.loginBrandig(this.domainExits?.domain, this.domainExits?.id).subscribe(data => {
            if (data.status == 200) {
              this.domainRecord = data.data;
            }

          })
          localStorage.setItem('subdomain', orogincalUrl);
          this.router.navigate(['/login'], {
            replaceUrl: true
          })
        }
        if (results.status == 404) {
          this.router.navigate(['/not-found']);
        }
        if (results.status == 500) {
          this.toaster.error('Unable To Process, Please check your internet connecation');
        }

      })
    }

  }


  ngOnInit(): void { }

  checked = false;
  showAnuual = false;
  package(e: any, value) {
    if (e.target.checked == false) {
      this.showAnuual = false;
    }
    else if (e.target.checked == true) {
      this.showAnuual = true;
    }
  }

}
