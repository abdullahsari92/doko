import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'isnullSetDash',
  pure: false
})
export class isNullPipe implements PipeTransform {

  constructor(

    private translate:TranslateService,
    private localStorageService:LocalStorageService
  ){

  }  
  transform(key: any): any {
   
  

    if(key)    
       return key
    else
        return '-';
  }
}
