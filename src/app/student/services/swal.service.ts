import {Injectable} from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '../../core/services/translate.service';

@Injectable({
	providedIn: 'root'
})
export class swalService {
	public langChange = [];
	constructor(
		private translate: TranslateService
	) {
		this.langChange['adi']='NAME';
		this.langChange['soyadi']='LASTNAME';
		this.langChange['anne_adi']='MOTHERNAME';
		this.langChange['baba_adi']='FATHERNAME';
		this.langChange['dogum_yeri']='BIRTHPLACE';
		this.langChange['dogum_tarihi']='BIRTHDATE';
		this.langChange['cinsiyet']='GENDER';
		this.langChange['email']='EMAIL';
		this.langChange['ulke']='COUNTRY';
		this.langChange['sehir']='CITY';
		this.langChange['adres']='ADRESS';
		this.langChange['telefon']='TELEPHONE';
		this.langChange['telefon2']='TELEPHONE2';
		this.langChange['resim']='IMAGE';
	}
	swalDefault(title: string, text: string, icon: string){
		Swal.fire({
			title: 	title,
			html: 	text,
		//	icon: 	icon
		});
	}
	swalArrayDefault(array: object, title: string, icon: string){
		let message = '';
		for (let val in array){
			message += this.translate.instant('ERROR.' + array[val], {name: this.translate.instant('TEXT.' + this.langChange[val])}) + '<br/>';
		}
		Swal.fire({
			title: 	title,
			html: 	message,
			//icon: 	icon
		});
	}
	swalChangesSaved(title: string){
		Swal.fire({
		//position: 'top-center',
			icon: 'success',
			title: title,
			showConfirmButton: false,
			//timer: 1500
		});
	}
}
