import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '../../../core/services/translate.service';
import { ErrorService } from '../../services/error.service';
import { finalize, tap } from 'rxjs/operators';
import { StudentService } from '../../services/student.service';
import Swal from 'sweetalert2';
import { countryModel } from '../../models/country.model';
import { fieldValidations } from '../../../core/Enums/fieldValidations';

@Component({
	selector: 'kt-contact-information',
	templateUrl: './contact-information.component.html',
	styleUrls: [
		'./contact-information.component.scss',	]
})
export class ContactInformationComponent implements OnInit {
	public countryList: countryModel[] = [];
	public errorState: boolean = false;
	validations = fieldValidations;
	contactInfoForm = new FormGroup({
		eposta: new FormControl('', [
			Validators.required,
			Validators.email
		]),
		telefon_no: new FormControl('telefon', [
			Validators.required
		]),
		telefon: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.telefon)
		]),
		whatsapp_no: new FormControl(''),
		diger_telefon_no: new FormControl(''),
		ulke_kodu: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.kod4)
		]),
		adres: new FormControl('', [
			Validators.required
		]),
		sehir: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.metin)
		])
	});
	constructor(
		public translate: TranslateService,
		private errorService: ErrorService,
		private studentService: StudentService,
		private cdr: ChangeDetectorRef
	) { }
	ngOnInit(): void {
		this.contactInfo();
		this.countryInfo();
	}
	contactInfo() {
		this.studentService.contactInfo().pipe(
			tap(data => {
				if (data.result) {
					console.log("--", data);

					Object.keys(this.contactInfoForm.controls).forEach((key) => {

						if (key == "telefon" && data.data[key] !== undefined && data.data[key] !== '' && data.data[key] !== null) {
							this.contactInfoForm.get('telefon_no').setValue(key);
							this.telefonSecim(null, key);
						} else if (key == "whatsapp_no" && data.data[key] !== undefined && data.data[key] !== '' && data.data[key] !== null) {
							this.contactInfoForm.get('telefon_no').setValue(key);
							this.telefonSecim(null, key);
						} else if (key == "diger_telefon_no" && data.data[key] !== undefined && data.data[key] !== '' && data.data[key] !== null) {
							this.contactInfoForm.get('telefon_no').setValue(key);
							this.telefonSecim(null, key);
						}

						this.contactInfoForm.get(key).setValue(data.data[key]);
					}); 		

			
				}
			}),
			finalize(() => {
				this.cdr.markForCheck();
			})
		)
			.subscribe();
	}
	countryInfo() {
		this.studentService.countryInfo().pipe(
			tap(rest => {
				if (rest.result) {
					(rest.data).forEach(vals => {
						this.countryList.push({
							'kodu': vals.kodu,
							'adi_tr': vals.adi_tr,
							'adi_en': vals.adi_en
						});
					});
				}
			}),
			finalize(() => {
				this.cdr.markForCheck();
			})).subscribe();
	}
	telefonSecim(e?: any, tip?: string) {
		let tel_tipi = (tip !== undefined && tip !== null) ? tip : e.target.value;
		console.log('tel', tel_tipi);


		document.getElementById('telefon_step').className = 'form-group row d-none';
		this.contactInfoForm.get('telefon').setValue(null);
		this.contactInfoForm.controls['telefon'].clearValidators();
		this.contactInfoForm.get('telefon').updateValueAndValidity();

		document.getElementById('whatsapp_no_step').className = 'form-group row d-none';
		this.contactInfoForm.get('whatsapp_no').setValue(null);
		this.contactInfoForm.controls['whatsapp_no'].clearValidators();
		this.contactInfoForm.get('whatsapp_no').updateValueAndValidity();

		document.getElementById('diger_telefon_no_step').className = 'form-group row d-none';
		this.contactInfoForm.get('diger_telefon_no').setValue(null);
		this.contactInfoForm.controls['diger_telefon_no'].clearValidators();
		this.contactInfoForm.get('diger_telefon_no').updateValueAndValidity();

		if (tel_tipi == 'telefon') {
			document.getElementById('telefon_step').className = 'form-group row';
			this.contactInfoForm.controls['telefon'].setValidators([
				Validators.required,
				Validators.pattern(this.validations.telefon)
			]);
			this.contactInfoForm.get('telefon').updateValueAndValidity();
		} else if (tel_tipi == 'whatsapp_no') {
			document.getElementById('whatsapp_no_step').className = 'form-group row';
			this.contactInfoForm.controls['whatsapp_no'].setValidators([
				Validators.required,
				Validators.pattern(this.validations.whatsapp)
			]);
			this.contactInfoForm.get('whatsapp_no').updateValueAndValidity();
		} else {//diger_telefon_no
			document.getElementById('diger_telefon_no_step').className = 'form-group row';
			this.contactInfoForm.controls['diger_telefon_no'].setValidators([
				Validators.required,
				Validators.pattern(this.validations.sayisalAlan)
			]);
			this.contactInfoForm.get('diger_telefon_no').updateValueAndValidity();
		}
	}
	errorControl(input: string): any {
		let result = this.errorService.errorControl(input, this.contactInfoForm);
		if (input === '*') {
			this.errorState = result;
		} else {
			return result;
		}
	}
	update() {
		this.errorControl("*");
		if (this.contactInfoForm.valid) {
			this.studentService
				.contactUpdate(this.contactInfoForm.value)
				.subscribe(res => {
					if (res.result) {
						Swal.fire({
							text: this.translate.instant("TEXT.UPDATE_SUCCESSFUL"),
							icon: 'success',
							showConfirmButton: false,
							timer: 2500
						});
					} else {
						Swal.fire({
							text: this.translate.instant("TEXT.OPERATION_FAILED"),
							html: this.errorService.arrayError(res.error.message),
							icon: 'error',
							showConfirmButton: true
						});
					}
				});
		}
	}
}
