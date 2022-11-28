import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class UlkeTanimService extends BaseCrudService {

  constructor(
    protected dokoSettingsService: DokoSettingsService,
    protected http: HttpClient,
    protected localStorageService: LocalStorageService
  ) {
    super(dokoSettingsService, http, 'admin/country/');

  }

  // getDeneme() {
  //   var deger = this.localStorageService.getItem("tokenModel");
  //   var birim = this.localStorageService.getItem("apiSetting").birim_uid;
  //   return this.http.get(this.dokoSettingsService.apiUrl + "admin/report/viewer/" + deger.token + "/" + birim, { responseType: 'text' });

  // }




}
