import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })
};
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl: any = environment.apiUrl;
  constructor(private http: HttpClient) {
   }

  get(url: any) {
    return this.http.get<any>(`${this.apiUrl}${url}`, httpOptions);
  }
  
  post(url: any, object: any, IsAuth = false) {
    // const token = localStorage.getItem('token');
    // const  headers = new  HttpHeaders().set("x-access-token", token);
    // return this.http.post<any>(`${this.apiUrl}${url}`, object,{headers});
    return this.http.post<any>(`${this.apiUrl}${url}`, object, httpOptions);
  }
  put(url: any, object: any, IsAuth = false) {
    // const token = localStorage.getItem('token');
    // const  headers = new  HttpHeaders().set("x-access-token", token);
    // return this.http.post<any>(`${this.apiUrl}${url}`, object,{headers});
    return this.http.put<any>(`${this.apiUrl}${url}`, object, httpOptions);
  }

  delete(url: any) {
    return this.http.delete<any>(`${this.apiUrl}${url}`, httpOptions);
  }
}
