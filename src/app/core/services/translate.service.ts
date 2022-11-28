import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class TranslateService implements OnInit {
  data: any = {};
  translation: any;
  language: string = "";
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {
    this.language = this.localStorageService.getItem("language");
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  //this.translation:any[]=[];
  use(lang: string = 'tr'): Promise<{}> {
    if (this.localStorageService.getItem("language")) {
      this.localStorageService.setItem("language", lang);
    }
    lang = this.localStorageService.getItem("language");
    return new Promise<{}>((resolve, reject) => {
      this.translation = this.localStorageService.getItem("languagesDefitions");
      Object.keys(this.translation).forEach((key: any) => {
        this.translation[key] = this.translation[key][lang];
      });
      this.data = Object.assign({}, this.translation || {});
      resolve(true);
    });
  }

  instant(key: string, value?: any) {
    this.language = this.localStorageService.getItem("language");
    this.translation = this.localStorageService.getItem("languagesDefitions");
    if (this.language) {
      if (this.translation[key]) {
        return this.translation[key][this.language];
      }
      else {
        return key;
      }
    }
  }
  getDefaultLang() {
    return "tr";
  }
}
