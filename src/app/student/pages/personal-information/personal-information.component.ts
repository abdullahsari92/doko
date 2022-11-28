import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { finalize, tap } from 'rxjs/operators';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorService } from '../../services/error.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '../../../core/services/translate.service';
//import {swalService} from '../../services/swal.service';
import { DokoSettingsService } from '../../../core/services/doko-settings.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { fieldValidations } from '../../../core/Enums/fieldValidations';
import { SharedService } from '../../services/shared.service';

@Component({
	selector: 'kt-personal-information',
	templateUrl: './personal-information.component.html',
	styleUrls: [
		'./personal-information.component.scss',
	]
})
export class PersonalInformationComponent implements OnInit {
	validations = fieldValidations;
	public selectedTab: number = 1;

	public file64: string | ArrayBuffer = null;
	public image: string | ArrayBuffer = null;
	public userImage: string = null;
	public imageRemove: boolean;
	personalInfoForm = new FormGroup({
		resim: new FormControl('', [
			Validators.required
		]),
		kimlik_no: new FormControl('', [
			Validators.pattern(this.validations.kimlik_no)
		]
		),
		adi: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.buyuk_harf_metin)
		]),
		soyadi: new FormControl('', [
			Validators.required,
			Validators.pattern(this.validations.buyuk_harf_metin)
		]),
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

	maxYear = (new Date()).getFullYear() - 17;
	maxDate = new Date(this.maxYear, 0, 1);
	minYear = (new Date()).getFullYear() - 150;
	minDate = new Date(this.minYear, 0, 1);

	constructor(
		private translate: TranslateService,
		private sharedService: SharedService,
		private studentService: StudentService,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private errorService: ErrorService,
		public datepipe: DatePipe,
		private router: Router,
		//private swalServicee: swalService,
		private dokoSettingsService: DokoSettingsService
	) { }

	changeTab(tab: number) {
		this.selectedTab = tab;
	}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			console.log('gelen ', params);
			this.selectedTab = params['id'];
		});
		this.getStudentInfo();
	}
	getStudentInfo() {
		this.studentService
			.personalInfo()
			.pipe(
				tap(res => {
					if (res.result) {
						this.userImage = ((res.data["resim"]) == null || res.data["resim"] == '' ? './assets/student/dashboard/media/users/' + ((res.data.cinsiyet == 'E') ? '001-boy' : '010-girl-4') + '.svg' : res.data["resim"]);

						this.image = 'url(' + this.userImage + ')';

						Object.keys(this.personalInfoForm.controls).forEach((key) => {
							if (key === 'resim') {
								if (res.data[key]) {
									this.image = 'url(' + this.dokoSettingsService.apiUrl + res.data[key] + ')';

									this.userImage = this.dokoSettingsService.apiUrl + res.data[key];
									this.personalInfoForm.get(key).setValue(res.data[key]);
								}/*  else {
									this.fileControl();
								} */
							} else {
								this.personalInfoForm.get(key).setValue(res.data[key]);
							}
						});
						this.personalInfoForm.get("dogum_tarihi").setValue(new Date(res.data.dogum_tarihi));

						if (res.data["kimlik_no"] != null && res.data["kimlik_no"] != '') {
							console.log('kimlikte');
							this.personalInfoForm.controls['kimlik_no'].setValidators([
								Validators.required,
								Validators.pattern(this.validations.kimlik_no)
							]);
							this.personalInfoForm.get('kimlik_no').updateValueAndValidity();
						}
					}
				}),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	errorControl(input: string): any {
		/* if (input === 'resim') {
			if (this.personalInfoForm.controls.resim.errors) {
				return this.translate.instant('VALIDATION.REQUIRED', { name: this.translate.instant('TEXT.resim') });
			}
		} */
		return this.errorService.errorControl(input, this.personalInfoForm);
	}

	fileChange(files: FileList) {
		let me = this;
		let file = files[0];
		let reader = new FileReader();
		if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
			reader.readAsDataURL(file);
			reader.onload = function () {
				me.file64 = reader.result;
				me.image = 'url("' + me.file64 + '")';
				me.fileControl(me.file64);
				me.cdr.markForCheck();
			};
			reader.onerror = function (error) {
				console.log('Resim hatası', error);
			}
		} else {
			Swal.fire({
				text: (this.translate.instant('TEXT.FORMAT')).replace('{{name}}', 'png/ jpg/ jpeg'),
				icon: 'error',
				showConfirmButton: false,
				timer: 4000
			});
			//	this.swalServicee.swalDefault(this.translate.instant('VALIDATION.ERROR'), this.translate.instant('VALIDATION.NOTFORMAT'), 'error');
		}
	}
	removeFile() {
		this.fileControl();
	}
	fileControl(file?) {
		if (file) {
			//this.personalInfoForm.addControl("resim", new FormControl(""))
			this.personalInfoForm.get('resim').setValue(file);
			this.imageRemove = true;
		} else {
			this.image = 'url(' + this.userImage + ')';
			if ((this.userImage).search('.svg') == -1) {
				this.personalInfoForm.get('resim').setValue(this.userImage);
			} else {
				this.personalInfoForm.get('resim').setValue(null);
			}

			this.imageRemove = false;
		}
	}
	dataFormat(personalForm: any) {
		personalForm.dogum_tarihi = this.datepipe.transform(personalForm.dogum_tarihi, "dd/MM/yyyy");

		return personalForm;
	}
	update() {
		if (this.personalInfoForm.valid) {
			var personelModel = this.personalInfoForm.value;
			personelModel = this.dataFormat(personelModel);
			this.studentService
				.personalUpdate(personelModel)
				.subscribe(res => {
					if (res.result) {
						Swal.fire({
							title: this.translate.instant("TEXT.PROCESS_CONTINUE"),
							text: this.translate.instant("TEXT.BACK_TO_ACTION"),
							icon: 'success',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							confirmButtonText: this.translate.instant("TEXT.DASHBOARD"),
							cancelButtonText: this.translate.instant("TEXT.CANCEL"),
							allowOutsideClick: false,
							showConfirmButton: true,
						}).then((result) => {
							this.getStudentInfo();
							this.sharedService.sendImageEvent("test");
							this.imageRemove = false;
							if (result.isConfirmed) {
								this.router.navigateByUrl('/homepage');
							}
						});
					} else {
						Swal.fire({
							text: this.translate.instant("TEXT.OPERATION_FAILED"),
							icon: 'error',
							showConfirmButton: false,
							timer: 1500
						});
					}
				});
		}
	}
}


