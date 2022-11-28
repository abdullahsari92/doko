import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { TranslateService } from '../../../../core/services/translate.service';
import { SregisterModel } from '../../../models/sregister.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { countryModel } from '../../../models/country.model';
import { finalize, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { apiSetting } from '../../../../../../src/app/core/models/apiSetting';
import { LocalStorageService } from '../../../services/local-storage.service';
import * as _moment from 'moment';
import { DatePipe } from '@angular/common';
import { fieldValidations } from '../../../../core/Enums/fieldValidations';
import { ErrorService } from '../../../services/error.service';
import { TextDisplayComponent } from '../../ogrenci-basvuru/text-display/text-display.component';
import { MatDialog } from '@angular/material/dialog';
import { upperCase } from 'lodash';

const moment = _moment;

@Injectable({
	providedIn: 'root'
})
@Component({
	selector: 'kt-register.height100',
	templateUrl: './register.component.html',
	styleUrls: [
		'./register.component.scss',
	]

})
export class RegisterComponent implements OnInit {
	validations = fieldValidations;
	step1 = new FormGroup({
		adi: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.buyuk_harf_metin)
		]),
		soyadi: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.buyuk_harf_metin)
		]),
		kimlik_pasaport_no: new FormControl('', [
			Validators.required
		]),
		kimlik_no: new FormControl('', [
			Validators.required
		]),
		pasaport_no: new FormControl(''),
		anne_adi: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.buyuk_harf_metin)
		]),
		baba_adi: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.buyuk_harf_metin)
		]),
		dogum_yeri: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.buyuk_harf_metin)
		]),
		dogum_tarihi: new FormControl('', [
			Validators.required
		]),
		cinsiyet: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.kod2)
		])
	});
	step2 = new FormGroup({
		email: new FormControl('', [
			Validators.required,
			Validators.email
		]),
		ulke: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.kod4)
		]),
		sehir: new FormControl('', [
			Validators.required
		]),
		adres: new FormControl('', [
			Validators.required
		]),
		telefon_no: new FormControl('telefon', [
			Validators.required
		]),
		telefon: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.telefon)
		]),
		whatsapp_no: new FormControl('', [
			//Validators.pattern(this.validations.telefon)
		]),
		diger_telefon_no: new FormControl('', [
			//Validators.pattern(this.validations.telefon)
		]),
		kvkk: new FormControl('', [
			Validators.requiredTrue
		]),
		acik_riza_beyani: new FormControl('', [
			Validators.requiredTrue
		])
	});

	public language_change = [];
	public stepTotal: number = 2;
	public stepNo: number = 1;
	public errorState: boolean = false;
	public registerModel: SregisterModel = new SregisterModel();
	public countryList: countryModel[] = [];
	apiSetting: apiSetting = new apiSetting();

	maxYear = (new Date()).getFullYear() - 17;
	maxDate = new Date(this.maxYear, 0, 1);
	minYear = (new Date()).getFullYear() - 150;
	minDate = new Date(this.minYear, 0, 1);

	constructor(
		private translate: TranslateService,
		private router: Router,
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private localStorageService: LocalStorageService,
		private datePipe: DatePipe,
		private errorService: ErrorService,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.apiSetting = this.localStorageService.getItem("apiSetting") as apiSetting;
		this.authService
			.getCountry()
			.pipe(
				tap(res => {
					res.data.forEach(vals => {
						this.countryList.push({
							'kodu': vals.kodu,
							'adi_tr': vals.adi_tr,
							'adi_en': vals.adi_en
						});
					});
				}),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe()
	}
	kvkkUrl() {
		let url = this.localStorageService.getActiveLang() == 'tr' ? this.apiSetting['kvkk_metni_url_tr'] : this.apiSetting['kvkk_metni_url_en']
		window.open(url, "_blank");
	}
	acikRizaBeyani() {
		let title = this.translate.instant("TEXT.acik_riza_beyani");
		let text = this.localStorageService.getActiveLang() == 'tr' ? this.apiSetting['acik_riza_beyani_tr'] : this.apiSetting['acik_riza_beyani_en'];
		let data = { text: text, title: title };
		const dialogRef = this.dialog.open(TextDisplayComponent, { data, width: "65%", minWidth: "350px"});
		dialogRef.afterClosed().subscribe(refData => {
			
		});
	}
	onKeypressEvent(input, event: any){
		this.step1.get(input).setValue((event.target.value).toUpperCase());
	 }
	stepChange(state: string) {
		if (state) {
			if (state === 'next') {
				let stepName = this.stepNo === 1 ? 'step1' : 'step2';
				this.errorControl(stepName, '*');
				if (this.errorState === false) {
					this.stepNo++;
				}
			} else if (state === 'prev') {
				this.stepNo--;
			}
		}
	}
	uyrukSecim(e) {
		if (e.target.value === 'kimlik_no') {
			document.getElementById('kimlik_no_step').className = 'form-group';
			this.step1.controls['kimlik_no'].setValidators([
				Validators.required,
				Validators.pattern(this.validations.kimlik_no)
			]);
			this.step1.get('kimlik_no').updateValueAndValidity();
			document.getElementById('pasaport_no_step').className = 'form-group d-none';
			this.step1.get('pasaport_no').setValue(null);
			this.step1.controls['pasaport_no'].clearValidators();
			this.step1.get('pasaport_no').updateValueAndValidity();
		} else if (e.target.value === 'pasaport_no') {
			document.getElementById('pasaport_no_step').className = 'form-group';
			this.step1.controls['pasaport_no'].setValidators([
				Validators.required,
				Validators.pattern(this.validations.pasaport)
			]);
			this.step1.get('pasaport_no').updateValueAndValidity();
			document.getElementById('kimlik_no_step').className = 'form-group d-none';
			this.step1.get('kimlik_no').setValue(null);
			this.step1.controls['kimlik_no'].clearValidators();
			this.step1.get('kimlik_no').updateValueAndValidity();
		} else {
			document.getElementById('kimlik_no_step').className = 'form-group';
			document.getElementById('pasaport_no_step').className = 'form-group';
			this.step1.controls['kimlik_no'].setValidators([
				Validators.required,
				Validators.pattern(this.validations.kimlik_no)
			]);
			this.step1.get('kimlik_no').updateValueAndValidity();
			this.step1.controls['pasaport_no'].setValidators([
				Validators.required,
				Validators.pattern(this.validations.pasaport)
			]);
			this.step1.get('pasaport_no').updateValueAndValidity();
		}
	}
	telefonSecim(e) {

		document.getElementById('telefon_step').className = 'form-group d-none';
		this.step2.get('telefon').setValue(null);
		this.step2.controls['telefon'].clearValidators();
		this.step2.get('telefon').updateValueAndValidity();

		document.getElementById('whatsapp_no_step').className = 'form-group d-none';
		this.step2.get('whatsapp_no').setValue(null);
		this.step2.controls['whatsapp_no'].clearValidators();
		this.step2.get('whatsapp_no').updateValueAndValidity();

		document.getElementById('diger_telefon_no_step').className = 'form-group d-none';
		this.step2.get('diger_telefon_no').setValue(null);
		this.step2.controls['diger_telefon_no'].clearValidators();
		this.step2.get('diger_telefon_no').updateValueAndValidity();

		if (e.target.value === 'telefon') {
			document.getElementById('telefon_step').className = 'form-group';
			this.step2.controls['telefon'].setValidators([
				Validators.required,
				Validators.pattern(this.validations.telefon)
			]);
			this.step2.get('telefon').updateValueAndValidity();

			/* document.getElementById('whatsapp_no_step').className = 'form-group d-none';
			this.step2.get('whatsapp_no').setValue(null);
			this.step2.controls['whatsapp_no'].clearValidators();
			this.step2.get('whatsapp_no').updateValueAndValidity(); */
		} else if (e.target.value === 'whatsapp_no') {
			document.getElementById('whatsapp_no_step').className = 'form-group';
			this.step2.controls['whatsapp_no'].setValidators([
				Validators.required,
				Validators.pattern(this.validations.whatsapp)
			]);
			this.step2.get('whatsapp_no').updateValueAndValidity();
			/* document.getElementById('telefon_step').className = 'form-group d-none';
			this.step2.get('telefon').setValue(null);
			this.step2.controls['telefon'].clearValidators();
			this.step2.get('telefon').updateValueAndValidity(); */
		} else {//diger_telefon_no
			document.getElementById('diger_telefon_no_step').className = 'form-group';
			this.step2.controls['diger_telefon_no'].setValidators([
				Validators.required,
				Validators.pattern(this.validations.sayisalAlan)
			]);
			this.step2.get('diger_telefon_no').updateValueAndValidity();

			/* document.getElementById('telefon_step').className = 'form-group d-none';
			this.step2.get('telefon').setValue(null);
			this.step2.controls['telefon'].clearValidators();
			this.step2.get('telefon').updateValueAndValidity();
			document.getElementById('whatsapp_no_step').className = 'form-group d-none';
			this.step2.get('whatsapp_no').setValue(null);
			this.step2.controls['whatsapp_no'].clearValidators();
			this.step2.get('whatsapp_no').updateValueAndValidity(); */
		}
	}
	errorControl(arr: string, state: string): any {
		let message = [];
		if (arr && state) {
			if (arr === 'step1') {
				if (state === '*') {
					for (let err in this.step1.controls) {
						if (this.step1.controls[err].errors === null) {
							this.errorState = false;
						} else {
							this.errorState = true;
							return false;
						}
					}
				} else {
					for (let err in this.step1.get(state).errors) {
						message.push(this.errorMessage(state, err));
					}
				}
			} else {
				if (state === '*') {
					for (let err in this.step2.controls) {
						if (this.step2.controls[err].errors === null) {
							this.errorState = false;
						} else {
							this.errorState = true;
							return false;
						}
					}
				} else {
					for (let err in this.step2.get(state).errors) {
						message.push(this.errorMessage(state, err));
					}
				}
			}
		}
		return message === null ? false : message;
	}

	errorMessage(state: string, type: string): string {
		if (state && type) {
			return (this.translate.instant('VALIDATION.' + (type).toUpperCase())).replace('{{name}}', this.translate.instant('TEXT.' + state));
		}
	}
	register() {
		this.errorControl('step1', '*');
		this.errorControl('step2', '*');
		if (this.errorState === false) {
			this.registerModel.adi = this.step1.value.adi;
			this.registerModel.soyadi = this.step1.value.soyadi;
			this.registerModel.kimlik_pasaport_no = this.step1.value.kimlik_pasaport_no;
			this.registerModel.kimlik_no = this.step1.value.kimlik_no;
			this.registerModel.pasaport_no = this.step1.value.pasaport_no;
			this.registerModel.anne_adi = this.step1.value.anne_adi;
			this.registerModel.baba_adi = this.step1.value.baba_adi;
			this.registerModel.dogum_yeri = this.step1.value.dogum_yeri;
			this.registerModel.dogum_tarihi = this.datePipe.transform(this.step1.value.dogum_tarihi, 'dd-MM-yyyy');
			this.registerModel.cinsiyet = this.step1.value.cinsiyet;
			this.registerModel.ulke_kodu = this.step2.value.ulke;
			this.registerModel.sehir = this.step2.value.sehir;
			this.registerModel.eposta = this.step2.value.email;
			this.registerModel.adres = this.step2.value.adres;
			this.registerModel.telefon_no = this.step2.value.telefon_no;
			this.registerModel.telefon = this.step2.value.telefon;
			this.registerModel.whatsapp_no = this.step2.value.whatsapp_no;
			this.registerModel.diger_telefon_no = this.step2.value.diger_telefon_no;
			this.registerModel.kvkk = this.step2.value.kvkk;
			this.registerModel.acik_riza_beyani = this.step2.value.acik_riza_beyani;
			
			this.authService
				.register(this.registerModel)
				.subscribe(resy => {
					console.log('kayıt oluştur', resy);
					
					if (resy.result) {
						Swal.fire({
							title: this.translate.instant('VALIDATION.SUCCESS'),
							text: this.translate.instant('TEXT.kayit_ol_mesaj'),
							icon: 'success'
						}).then((res) => {
							if (res.isConfirmed) {
								this.router.navigateByUrl('/login');
							}
						});
					} else {
						Swal.fire({
							text: this.translate.instant("TEXT.OPERATION_FAILED"),
							html: this.errorService.arrayError(resy.error.message),
							icon: 'error',
							showConfirmButton: true
						});
					}
				},
					error => {
						console.log('kayıt oluşturerror', error);
						Swal.fire({
							title: this.translate.instant('ERROR.' + error.error.error.code),
							text: this.errorService.arrayError(error.error.error.message),
							icon: 'error'
						});
					});
		}
	}

	convert(str) {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join("-");
	}
}
