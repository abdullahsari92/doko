import {Injectable} from '@angular/core';
import {DokoSettingsService} from '../../core/services/doko-settings.service';
import {SloginModel} from '../models/slogin.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {sha512} from 'js-sha512';
import {SdataModel} from '../models/sdata.model';
import {catchError, map} from 'rxjs/operators';
import {countryModel} from '../models/country.model';
import {SregisterModel} from '../models/sregister.model';
import { apiResult } from '../../core/models/apiResult';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	headers:any
	constructor(
		private dokoApi: DokoSettingsService,
		private http: HttpClient,
	) {}
	/*login(slogin: SloginModel): Observable<any>{
		slogin.key = sha512(slogin.eposta + slogin.sifre + 'eb73i7fumaenbvn6hbbd8rwabs4wc6qycxyiet68');
		return this.http.post<any>(this.dokoApi.localapiUrl + 'student/login', slogin);
	}
	register(sregister: SregisterModel): Observable<any>{
		return this.http.post<any>(this.dokoApi.localapiUrl + 'student/register/register', sregister);
	}
	updatePass(email: string): Observable<any>{
		return this.http.post<any>(this.dokoApi.localapiUrl + 'student/student/update_pass', email);
	}
	getCountry(): Observable<countryModel[]>{
		return this.http.post<countryModel[]>(this.dokoApi.localapiUrl + 'student/register/country', '');
	}*/
	welcome(): Observable<any>{
		return this.http.post<any>(this.dokoApi.apiUrl + 'welcome', null);
	}
	login(slogin: SloginModel): Observable<any>{
		slogin.key = sha512(slogin.eposta + slogin.sifre + 'dgdgdgdrrtrtrtr');
		return this.http.post<any>(this.dokoApi.apiUrl + 'student/login', slogin);
	}
	register(sregister: SregisterModel): Observable<any>{
		return this.http.post<any>(this.dokoApi.apiUrl + 'student/register/register', sregister);
	}
	updatePass(email: string): Observable<any>{
		var body = { eposta: email }
		// return this.http.post<any>(this.dokoApi.apiUrl + 'student/student/update_pass', email);
		return this.http.post<any>(this.dokoApi.apiUrl + 'student/register/reset_pass', body);
	}
	getCountry(): Observable<apiResult>{
		return this.http.post<apiResult>(this.dokoApi.apiUrl + 'student/register/country', '');
	}
}
