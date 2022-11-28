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
export class YetkiTanimService extends BaseCrudService {

  endPoint2 = "admin/authority/";

  constructor(
    protected dokoSettingsService: DokoSettingsService,
    protected http: HttpClient,
    protected localStorageService: LocalStorageService
  ) {
    super(dokoSettingsService, http, 'admin/authority/');

  }



  getAuthCanView(rolId:number): Observable<apiResult> {

    var body = {rol_id:rolId};

    return this.http.post<any>(this.dokoSettingsService.apiUrl + this.endPoint2 + "auth_view_get_list", body);
  }

  
}
