import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { sha512 } from 'js-sha512';
import { apiSetting } from '../../core/models/apiSetting';
import { loginModel } from '../../core/models/loginModel';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { apiResult } from '../../core/models/apiResult';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  headers: any
  constructor(
    private dokoSettingsService: DokoSettingsService,
    private http: HttpClient,
    private localStorageService: LocalStorageService
    //private svcIdentity: IdentityService,
  ) { }

  login(loginmodel: loginModel): Observable<any> {
    loginmodel.key = sha512(loginmodel.eposta + loginmodel.sifre + "ttttt");
    return this.http.post<any>(this.dokoSettingsService.apiUrl + 'admin/login', loginmodel);
  }

  register(ogrenci: any): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + "student/student/register", ogrenci);
  }

  ListTrainingPeriod(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + "admin/login/training_period_get_list", null);
  }

  logout() {
    return this.http.post<any>(this.dokoSettingsService.apiUrl + 'logout/index', null);
  }



}
