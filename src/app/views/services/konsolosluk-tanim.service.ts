import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { BaseCrudService } from './base-crud.service';
import { Observable } from 'rxjs';
import { apiResult } from '../../core/models/apiResult';

@Injectable({
  providedIn: 'root'
})
export class KonsoloslukTanimService {

  endPoint = "admin/consulate/";

  constructor(
    protected dokoSettingsService: DokoSettingsService,
    protected http: HttpClient,
    //protected localStorageService: LocalStorageService
  ) {

  }

  getList(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "get_list", null);
  }

  save(data): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "save", data);
  }

  delete(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(
      this.dokoSettingsService.apiUrl + this.endPoint + 'delete/', body);
  }

  getCountryList(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "country_list", null);
  }

}
