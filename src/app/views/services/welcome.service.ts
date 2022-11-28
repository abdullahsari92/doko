import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DokoSettingsService } from '../../core/services/doko-settings.service';

@Injectable({
	providedIn: 'root'
})
export class WelcomeService {

	endPoint = "welcome/";

	apiadres: string;
	localAdres: string;
	constructor(
		private http: HttpClient,
		private dokoSettingsService: DokoSettingsService
	) {
		this.apiadres = 'https://editorial.gateofscience.com/api/cms/';
		this.localAdres = 'https://localhost/api/cms/';
	}

	getApiSetting(): Observable<any> {

		const langPath = `assets/setting.json`;
		//return this.http.get<{}>(langPath);
		return this.http.post<any>(this.dokoSettingsService.apiUrl + 'welcome', null);
	}
	apiSetting(): Observable<any> {
		return this.http.post<any>(this.dokoSettingsService.apiUrl + 'welcome', null);
	}
	getApiAdresFark(): Observable<any> {
		var regTime = new Date().getTime() / 1000;
		var deger = new HttpHeaders({
			'Req-Time': regTime.toString(),
			'Content-Type': 'application/json'
		});

		return this.http.get<any>('http://localhost:1025/role/IdNameList');
	}

	getlanguages(): Observable<any> {
		return this.http.post<any>(this.dokoSettingsService.apiUrl + this.endPoint + "get_language", null);
	}

	getCountry(): Observable<any> {
		return this.http.post<any>(this.dokoSettingsService.apiUrl + this.endPoint + "country_get_list", null);
	}
}



