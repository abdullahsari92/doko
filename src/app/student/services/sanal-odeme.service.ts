import {DokoSettingsService} from '../../core/services/doko-settings.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {finalize, tap} from 'rxjs/operators';
import {countryModel} from '../models/country.model';
import { apiResult } from '../../core/models/apiResult';
import { sanalPosModel } from '../models/sanalPos.model';

@Injectable({
	providedIn: 'root'
})
export class SanalOdemeService {

	endPoint:string = "student/student/";
	constructor(
		private dokoApi: DokoSettingsService,
		private http: HttpClient
	) { }

	onlineOdeme(postData:sanalPosModel): Observable<any>{




		return this.http.post<any>('student/payment/ilke',postData);


	}

   



}

