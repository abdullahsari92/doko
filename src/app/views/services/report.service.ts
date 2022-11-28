import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiResult } from '../../core/models/apiResult';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { StimulSablonModel } from '../models/stimulSablon';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  //endPoint="admin/report/";
  endPoint = "report/";
  endPoint2 = "admin/application/";

  constructor(
    private http: HttpClient,
    private dokoSettingsService: DokoSettingsService
  ) { }

  //treedata alanı buradan gelir.
  getKategoriData(): Observable<any> {
    return this.http.post<any>(this.dokoSettingsService.apiUrl + this.endPoint + "get_report_category_data", null);
  }

  getListSablon(dataId): Observable<apiResult> {
    var body = { dataId: dataId };
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "report_get_list", body);
  }
  reportViewerData(): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "report_viewer", null);
  }

  //kolonların adı buradan gelir.
  getListColumnName(id: any): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "get_report_column_name", body);
    // return this.http.get<any>(this.dokoSettingsService.apiUrl +this.endPoint+ "get_report_data/1.1/0");
  }

  getReportSave(stimulSablonModel: StimulSablonModel): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "save_report", stimulSablonModel);
  }

  getReportUpdate(data): Observable<apiResult> {
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "update_report", data);
  }

  getReportId(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "report_get", body);
  }

  delete(id): Observable<apiResult> {
    var body = { id: id }
    return this.http.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'delete', body);
  }

  getListReportDefaultData(): Observable<any> {
    //const deger =  JSON.parse(JSON.stringify(contentModel));
    const langPath = `assets/report/reportJson.json`;
    return this.http.get<{}>(langPath);
  }

  report_file(id: any): Observable<any> {
    var regTime = new Date().getTime() / 1000;
    var reg = regTime.toString().split('.')[0];
    var httpOpt = {
      headers: new HttpHeaders({
        "Req-Time": reg,
      }),
      responseType: "blob" as 'json'
    }
    console.log(' report_file girdi')
    return this.http.get<any>(this.dokoSettingsService.apiUrl + 'report/report_file/' + id + '.mrt', httpOpt);
  }


}