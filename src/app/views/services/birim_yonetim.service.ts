import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiResult } from '../../core/models/apiResult';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { birimBasvuru } from '../models/birimBasvuru';

@Injectable({
  providedIn: 'root'
})
export class BirimYonetimService {

  endPoint = "admin/unitmgmt/";

  constructor(
    private http: HttpClient,
    private dokoSettingsService: DokoSettingsService
  ) { }

  getListRecourse(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "appeal_get_list", null);
  }

  getListDepartment(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "episode_get_list", null);
  }

  getListFaculty(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "faculty_get_list", null);
  }

  getListLanguage(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "language_get_list", null);
  }

  getListRecord(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "record_get_list", null);
  }

  getListScore(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "score_get_list", null);
  }

  getListTrainingPeriod(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "training_period_get_list", null);
  }

  getListLangExam(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "lang_exam_get_list", null);
  }

  getListReportGroupMap(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "get_report_group_map", null);
  }

  getListQuota(bolId): Observable<apiResult> {
    var body = { bol_id: bolId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "quota_get_list", body);
  }

  getCountryList(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "country_get_list", null);
  }

  saveTrainingPeriod(data: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "training_period_save", data);
  }

  saveScore(data: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "score_save", data);
  }

  saveLanguage(data: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "language_save", data);
  }

  saveRecord(data: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "record_save", data);
  }

  saveFaculty(data: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "faculty_save", data);
  }

  saveDepartment(data: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "episode_save", data);
  }

  saveRecourse(data: birimBasvuru): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "appeal_save", data);
  }

  saveLangExam(data: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "lang_exam_save", data);
  }

  saveQuota(data, bolId): Observable<apiResult> {
    data.bol_id = bolId;
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "quota_save", data);
  }

  removeTrainingPeriod(id: string): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'training_period_delete/', body);
  }

  removeDepartmen(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'episode_delete/', body);
  }

  removeLanguage(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'language_delete/', body);
  }

  removeRecord(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'record_delete/', body);
  }

  removeScore(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'score_delete/', body);
  }

  removeRecourse(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'appeal_delete/', body);
  }

  removeFaculty(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'faculty_delete/', body);
  }

  removeLangExam(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'lang_exam_delete/', body);
  }

  removeQuota(id: string): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'quota_delete/', body);
  }

}

