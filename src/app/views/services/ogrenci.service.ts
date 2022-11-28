import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiResult } from '../../core/models/apiResult';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { OgrenciModel } from '../models/ogrenciModel';

@Injectable({
  providedIn: 'root'
})
export class OgrenciService {

  endPoint = "admin/student/";

  constructor(
    private http: HttpClient,
    private dokoSettingsService: DokoSettingsService
  ) { }

  getList(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "get_list", null);
  }

  save(data: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "save", data);
  }

  remove(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(
      this.dokoSettingsService.apiUrl + this.endPoint + 'delete/', body);
  }

  getCountryList(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "country_list", null);
  }

  get_student_detail(og_di,egitim_donemi_id): Observable<apiResult> {
    var body = { og_id: og_di,egitim_donemi_id:egitim_donemi_id};

  console.log(' get_student_detail',body)
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "get_detail", body);
  }
  // removeLanguage(id): Observable<apiResult> {
  //   var body = { id: id }
  //   return this.http.post<apiResult>(
  //     this.dokoSettingsService.apiUrl + this.endPoint + 'language_delete/', body);
  // }

  //country_list

}

