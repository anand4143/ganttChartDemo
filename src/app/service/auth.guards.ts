import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";


@Injectable()
export class AuthGuard implements CanActivate {
    isAuthenticated: any
    constructor(
        private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> {
        const token: any = localStorage.getItem('token') ? true : false;
        if (token) {
            this.isAuthenticated = token
        }
        const companyToken: any = localStorage.getItem('companyToken') ? true : false;
        if (companyToken) {
            this.isAuthenticated = companyToken
        }
        const empToken: any = localStorage.getItem('empToken') ? true : false;
        if (empToken) {
            this.isAuthenticated = empToken
        }
        const pToken: any = localStorage.getItem('pToken') ? true : false;
        if (pToken) {
            this.isAuthenticated = pToken
        }
        const subdomain: any = localStorage.getItem('subdomain') ? true : false;
        if (subdomain) {
            this.isAuthenticated = subdomain
        }
       
        if (!this.isAuthenticated) {
            this.router.navigate(['/login']);
        }
        return this.isAuthenticated;
    }
}