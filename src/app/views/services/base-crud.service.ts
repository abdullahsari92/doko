
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { DokoSettingsService } from '../../core/services/doko-settings.service';
import { apiResult } from '../../core/models/apiResult';
@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService {

  constructor(
    protected dokoSettingsService: DokoSettingsService,
    protected httpClient: HttpClient,
    @Inject(String) private endPoint: any
  ) { }

  getList(): Observable<apiResult> {
    return this.httpClient.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "get_list", null);
  }

  save(data: any): Observable<apiResult> {
    return this.httpClient.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + "save", data);
  }

  delete(id: string): Observable<apiResult> {
    var body = { id: id }
    return this.httpClient.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'delete', body);
  }
  filter(model): Observable<HttpResponse<any>> {
    return this.httpClient.post<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'Filter', model, { observe: 'response' });
  }

  detail(id: string): Observable<apiResult> {
    return this.httpClient.get<apiResult>(this.dokoSettingsService.apiUrl + this.endPoint + 'detail/' + id);
  }


}
