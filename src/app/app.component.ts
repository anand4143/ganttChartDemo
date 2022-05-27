import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from './service/data.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lylli-launchpad';
  opened = true;
  login = false;
  status = false;
  home = false;
  script: any
  constructor(private dataService: DataService, private router: Router,private cd: ChangeDetectorRef,
    private titleService: Title, private breakpointObserver: BreakpointObserver, private renderer: Renderer2) {
    this.dataService.Home.subscribe((value) => {
      if (value == true) {
        this.home = true
      }
      else {
        this.home = false
      }
    })
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
          this.login = true;
        }
        else if (event.url === '/login') {
          this.login = true;
        }
        else if (event.url === '/signup') {
          this.login = true;
        }
        else if (event.url === '/forgot-password') {
          this.login = true;
        }
        else if (event.url === '/plan-price') {
          this.login = true;
        }
        else if (event.url === '/order-summary') {
          this.login = true;
        }
        else if (event.url === '/success') {
          this.login = true;
        }
        else if (event.url === '/fail') {
          this.login = true;
        }
        else if (event.url === '/pricing') {
          this.login = true;
        }
        else if (event.url === '/not-found') {
          this.login = true;
        }
        else if (event.url === '/contact') {
          this.login = true;
        }
        else if (event.url === '/UpgradePlanPrice') {
          this.login = true;
        }
        else if (event.url === '/security') {
          this.login = true;
        }
        else if (event.url === '/privacy-policy') {
          this.login = true;
        }
        else if (event.url === '/msa') {
          this.login = true;
        }
        else if (event.url === '/terms-conditions') {
          this.login = true;
        }
        else if (event.url === '/forgot-change-pass/:token') {
          this.login = true;
        }
        else if (event.url === '/FAQs') {
          this.login = true;
        }
        else if (event.url === '/accverification/:token') {
          this.login = true;
        }
        else if (event.url === '/intake-form') {
          this.login = true;
        }
        else if (event.url === '/customer-satisfaction') {
          this.login = true;
        }
        else if (event.url === '/about') {
          this.login = true;
        }
        else if (event.url === '/features') {
          this.login = true;
        }
        else if (event.url === '/live-demo') {
          this.login = true;
        }
        else {
          this.login = false;
        }
        if (event.url === '/' || event.url === '/live-demo' || event.url === '/features' ||
          event.url === '/about' || event.url === '/customer-satisfaction' || event.url === '/accverification/:token'
          || event.url === '/FAQs' || event.url === '/forgot-change-pass/:token' || event.url === '/terms-conditions'
          || event.url === '/UpgradePlanPrice' || event.url === '/privacy-policy' || event.url === '/msa' || event.url === '/security'
          || event.url === '/not-found' || event.url === '/contact' || event.url === '/pricing' || event.url === '/fail'
          || event.url === '/order-summary' || event.url === '/success' || event.url === '/plan-price' || event.url === '/signup' || event.url === '/forgot-password' || event.url === '/login') {
          this.script = this.renderer.createElement('script');
          this.script.src = `https://widget.flowxo.com/embed.js`;
          this.renderer.appendChild(document.head, this.script);
        }
        else{
          this.script = this.renderer.createElement('https://script.com');
          this.script.src = `script`;
          this.renderer.appendChild(document.head, this.script);
        }
      }

    });

  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }

  ngOnInit() {
    this.cd.detectChanges();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.breakpointObserver.observe([
      "(max-width: 1024px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.opened = false;
      } else {
        this.opened = true;
      }
    });
    const appTitle = this.titleService.getTitle();
  }
}
// <app-header *ngIf="!isLogin"></app-header>
// <router-outlet></router-outlet>
// app.component.ts

//   constructor (private zone: NgZone, private router: Router) {
//     this.router.events.subscribe((event: any) => {
//       if (event instanceof NavigationEnd) {
//         if (event.url === '/login') {
//           this.login= true;
//         } else {
//           this.login= false;
//         }
//       }
//     });
//   }