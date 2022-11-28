import {  Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {

  private languagesSubject = new BehaviorSubject<any>([]);

  translation:any;
  constructor(

    private translate:TranslateService,
    private localStorageService:LocalStorageService
  ){

  }
  transform(key: any): any {

   var lang =  this.localStorageService.getItem("language");

  //  this.translate.use(lang).then(p=>{
  //    this.langDegistir(this.translate.data)
  //  });
  //  this.currentLanguages.subscribe(p=>{
 
  //       console.log('p-'+key,p[key])
  //           // if(p[key])
  //            return p[key];
  //           // else
  //           //  return key;
      
  //  })

    this.translation =  this.localStorageService.getItem("languagesDefitions");

    if(lang)
    {
      if(this.translation[key])
      {
        return  this.translation[key][lang];

      }
      else
      {
         return key;
      }

    }

    // if(this.translate.data[key])
    //    return this.translate.data[key];
    // else
    //     return key;
  }

  currentLanguages = this.languagesSubject.asObservable();



  langDegistir(langguages:any) {

    this.languagesSubject.next(langguages);
  }

}
