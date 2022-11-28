import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiResult } from '../../core/models/apiResult';
import { DokoSettingsService } from '../../core/services/doko-settings.service';

@Injectable({
  providedIn: 'root'
})
export class BirimService {

  endPoint = "admin/unit/";

  constructor(
    private http: HttpClient,
    private dokoSettingsService: DokoSettingsService
  ) { }

  getListUnit(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "unit_get_list", null);
  }

  getListTrainingPeriod(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "training_period_get_list", null);
  }

  saveUnit(data: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "unit_save", data);
  }

  fileSave(data: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "unit_file", data);
  }

  deleteUnit(id: string): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'unit_delete/', body);
  }

}

