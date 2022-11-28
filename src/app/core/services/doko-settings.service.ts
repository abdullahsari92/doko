import { DatePipe, KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UcretOdemeTuru } from '../Enums/ucret-odeme.enum';
import { keyValue } from '../models/keyValue';
import { FormGroup } from '@angular/forms';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class DokoSettingsService {

  private previousUrl: string = undefined;
  private currentUrl: string = undefined;

  jwtSecurityKey = '';
  tokenKey = 'tttt';
  studentTokenKey = 'ttt';

  apiUrl = environment.apiUrl;
  sessionKey='ttt';

  siteUrl="";


  StimulsoftBaseStiLicensekey ="";

  calendarTr = {
    firstDayOfWeek: 1,
    dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarsamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    dayNamesShort: ['Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cte'],
    dayNamesMin: ['P', 'P', 'S', 'Ç', 'P', 'C', 'C'],
    monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    today: 'Bugün',
    dateFormat: 'dd/mm/yy',
    clear: 'Temizle'
  };

  selectedStatus = { key: -1, value: '[Tümü]' };
  selectedPageSize = { key: 10, value: '10' };

  statusOptions = [
    { key: -1, value: '[Tümü]' },
    { key: 1, value: 'Onaylı' },
    { key: 0, value: 'Onaysız' },
  ];

  selectLanguage = [
    { key: "Tr", value: 'tr' },
    { key: "En", value: 'en' },
    { key: "De", value: 'de' },
    { key: "Fr", value: 'fr' },
    { key: "Jp", value: 'jp' },


  ];


  rowsPerPageOptions = [
    5,
    10,
    25,
    50,
    100,
    500,
    { showAll: '[Tümü]' }
  ];

  pageSizes = [
  //  { key: -1, value: 'Tümü' },
    { key: 5, value: '5' },
    { key: 10, value: '10' },
    { key: 25, value: '25' },
    { key: 50, value: '50' },
    { key: 100, value: '100' },
    { key: 500, value: '500' },
  ];

  constructor(
    private router: Router,
    public datepipe: DatePipe,
    private translate:TranslateService

  ) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  public getPreviousUrl(): string {
    return this.previousUrl;
  }


  public getSelectBoxByEnumType(enumType:any): keyValue[] {

    var keyValueList:keyValue[]=[];
    var objectDeger =    Object.keys(enumType);
    objectDeger.slice(objectDeger.length / 2).forEach(p=>{  
      var keyValue:keyValue = {value:enumType[p],key:p,selected:false};
      keyValueList.push(keyValue);        
      })

    return keyValueList;  
  }

  
  isControlHasError(controlName: string, validationType: string,form:FormGroup): boolean {
		const control = form.controls[controlName];
		if (!control) {
			return false;
		}
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}



  convertDate(dataValue: any) {
   var sonuc = this.datepipe.transform(dataValue, "dd/MM/yyyy");

    return sonuc;
  }

  arrayError(params: Object): any {
		let message: string = "";
		if (typeof (params) == "object") {
			for (let keys in params) {
				message += this.errorMessage(keys, params[keys]) + '<br/>';
			}
		} else {
			message = this.translate.instant(params);
		}

		return message;
	}

  errorMessage(input: string, errorName: string): any {
		if (errorName) {
			return (this.translate.instant('VALIDATION.' + (errorName).toUpperCase())).replace('{{name}}', this.translate.instant('TEXT.' + input));
		}
	}
}
