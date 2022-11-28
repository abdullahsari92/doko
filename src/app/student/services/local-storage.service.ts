import { Injectable } from '@angular/core';
import { SloginModel } from '../models/slogin.model';
import { SdataModel } from '../models/sdata.model';
import { data } from 'jquery';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {
	public studentData: SdataModel = new SdataModel();
	constructor(
	) {

		this.dataControl();
	}
	sloginModel: SloginModel;
	dataControl() {
		if (localStorage.student_data !== undefined) {
			const items = JSON.parse(localStorage.getItem('student_data'));

			this.studentData = items.objectName.data;
		}
	}
	setItem(key: string, value: any) {
		localStorage.setItem(key, JSON.stringify({ objectName: value }));
	}
	getItem(key: string): any {
		const items = JSON.parse(localStorage.getItem(key));
		return items == null ? null : items.objectName;
	}
	getValueItem(key: string): any {
		this.dataControl();

		if ((Object.keys(this.studentData)).length > 0) {
			if (key === 'token') {
				return this.studentData[key];
			} else if (key === 'adi_soyadi' || key === 'eposta') {
				return this.studentData['user'][key];
			} else {
				return this.studentData['site'][key];
			}
		}
		return null;
	}
	removeItem(key: string) {
		localStorage.removeItem(key);
	}

	getActiveLang() {
		const items = JSON.parse(localStorage.getItem('language'));
		return items.objectName;
		//return localStorage.getItem('languageStudent') || 'tr';
	}

	getCountryList() {
		let list = JSON.parse(localStorage.getItem("countryList"));
		if(list){
			list = list.objectName;
			if (list.result) {
				return list.data;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	getUnitReferenceModule() {
		let list = JSON.parse(localStorage.getItem("apiSetting"));
		if(list){
			list = list.objectName.birim_basvuru_modulleri;
			if (list) {
				return JSON.parse(list);
			}else{
				return false;
			}
		}else{
			return false;
		}
	}

}
