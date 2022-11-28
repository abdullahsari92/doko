import {  Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'translateData',
  pure: false,
})
export class TranslateDataPipe implements PipeTransform {

  constructor(
    private localStorageService:LocalStorageService
  ){

  }

  transform(keytr: any,keyEn:any): any {
   var lang =  this.localStorageService.getItem("language");
   if(lang=='tr')
   {
      return keytr;
   }
   if(lang=='en')
   {
      return keyEn;
   } 
  
  }





}
