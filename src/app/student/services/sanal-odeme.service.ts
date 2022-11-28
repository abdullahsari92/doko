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

		        // $hashstr = $data['clientid'] . $data['oid'] . $data['amount'] . $data['okUrl'] . $data['failUrl'] . $data['transactionType'] . $data['taksit'] . $data['rnd'] . $data['storekey'];
        // $data['hash'] = base64_encode(pack('H*', sha1($hashstr)));
	 var deger = 	postData.clientid +postData.oid+postData.amount+postData.okUrl+postData.failUrl+postData.islemtipi+postData.taksit+postData.rnd+postData.storekey

		var sha1 = require('sha-1');
	  postData.hash =  btoa(sha1(deger))
		
		console.log(' postData.hash  ',postData.hash )
		return this.http.post<any>('https://dokoapi.dpu.edu.tr/student/payment/ilke',postData);


	}

   



}

