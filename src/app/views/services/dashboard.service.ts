import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { exit } from 'process';
import { Observable } from 'rxjs';
import { BasvuruTurEnum } from '../../core/Enums/BasvuruTurEnum';
import { apiResult } from '../../core/models/apiResult';
import { DokoSettingsService } from '../../core/services/doko-settings.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  endPoint = "admin/dashboard/";

  constructor(
    private http: HttpClient,
    private dokoSettingsService: DokoSettingsService
  ) { }

  getTotalNumberStudent(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "total_number_student", null);
  }

}
