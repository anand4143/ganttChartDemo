import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({  name: 'sanetizeHtml'})
export class SanetizeHtmlPipe implements PipeTransform {
  constructor(private _sanatizer:DomSanitizer){

  }
  transform(value:string): SafeHtml {
    return this._sanatizer.bypassSecurityTrustHtml(value);
  }

}
