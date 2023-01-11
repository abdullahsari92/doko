import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../core/services/translate.service';
import { BasvuruTurEnum } from '../../../../core/Enums/BasvuruTurEnum';
import { DokoSettingsService } from '../../../../core/services/doko-settings.service';
import { ErrorService } from '../../../services/error.service';
import { sanalPosModel } from '../../../../student/models/sanalPos.model';
import { SanalOdemeService } from '../../../../student/services/sanal-odeme.service';
import { StudentService } from '../../../../student/services/student.service';
import Swal from 'sweetalert2';
import { HomePageComponent } from '../../home-page/home-page.component';
import { TextDisplayComponent } from '../text-display/text-display.component';
import { LocalStorageService } from '../../../../student/services/local-storage.service';
import { OgrenciBasvuruDurumEnum } from '../../../../student/models/enums';
import { UcretOdemeTuru, UcretOdemeZamani } from '../../../../core/Enums/ucret-odeme.enum';
import { IdentityStudentService } from '../../../../student/services/identity-student.service';

@Component({
	selector: 'kt-hazirlik-basvuru',
	templateUrl: './hazirlik-basvuru.component.html',
	styleUrls: [
		'./hazirlik-basvuru.component.scss',
	]
})
export class HazirlikBasvuruComponent implements OnInit {
	//Diziler Başlangıç
	public sinavVerileri: any;
	public kabulKosulVerileri: any;
	public sinavMerkezVerileri: any;
	public posOdemeUrl: any;
	public secilenKabulMetin: any;
	//Diziler Bitiş
	//Bağlı Durumlar Başlangıç
	public bilgiDurum: boolean = false;
	public guncellemeDurum: boolean = false;
	public bilgiMesaj: string;
	isErrorKvkk: boolean;
	isErrorKayitTuru: boolean;
	isErrorKullanimKosulu: boolean;
	public errorState: boolean = false;
	ucretOdemeTuru = UcretOdemeTuru;
	ucretOdemeZamani = UcretOdemeZamani;
	sanalPosModel: sanalPosModel = new sanalPosModel();
	//Bağlı Durumlar Bitiş
	//Enum Durumlar Başlangıç
	ogrenciBasvuruDurumEnum = OgrenciBasvuruDurumEnum;
	//Enum Durumlar Bitiş
	//Formlar Başlangıç
	dekontUploadForm: FormGroup;
	hazirlikBasvuruForm = new FormGroup({
		ogrenci_basvuru_id: new FormControl(''),
		basvuru_id: new FormControl(''),
		kvkk: new FormControl('', [
			Validators.requiredTrue
		]),
		kullanim_kosullari: new FormControl('', [
			Validators.requiredTrue
		]),
		kabul_kosulu: new FormControl(''),
		merkez_id: new FormControl('', [
			/* Validators.required,
			Validators.pattern('[a-zA-Z0-9]{1}') */
		]),
		odeme_onay: new FormControl('')
	});
	//Formlar Bitiş

	@ViewChild('wizard', { static: true }) el: ElementRef;
	@ViewChild('step1', { static: true }) step1: ElementRef;
	constructor(
		public dialogRef: MatDialogRef<HomePageComponent>,
		private dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private studentService: StudentService,
		private sanalOdemeService: SanalOdemeService,
		private localStorageService: LocalStorageService,
		private fb: FormBuilder,
		public dokoSettingsService: DokoSettingsService,
		private http: HttpClient,
		private router: Router,
		private sanitizer: DomSanitizer,
		private translate: TranslateService,
		private identityStudentService: IdentityStudentService,
		private errorService: ErrorService,
		private cdr: ChangeDetectorRef
	) { }
	public stepsIDList = [];
	ngAfterViewInit(): void {
		const wizard = new KTWizard(this.el.nativeElement, {
			startStep: 1
		});
		wizard.steps.forEach(element => {
			this.stepsIDList.push(element.id);
		});
		var currentStep;
		var currentStepId;
		var nextStepID;

		if (this.guncellemeDurum) {
			document.getElementById('icon10').className = 'flaticon-globe iconSuccess';
			document.getElementById('icon20').className = 'flaticon-list-2 iconSuccess';
			document.getElementById('icon30').className = 'flaticon-map-location iconSuccess';
			document.getElementById('2icon30').className = 'flaticon2-checkmark iconSuccess';
		}
		if (this.guncellemeDurum && this.hazirlikBasvuruForm.get('odeme_onay').value !== null && this.hazirlikBasvuruForm.get('odeme_onay').value == 1) {
			document.getElementById('icon40').className = 'flaticon-globe iconSuccess';
		}
		wizard.on('beforeNext', (wizardObj) => {
			console.log('İLERİ', wizard);
			//const form = this.basvuruForm as FormGroup;
			currentStep = wizardObj.currentStep - 1;
			currentStepId = wizard.steps[currentStep].id;
			/* Birinci Alan (Sınav Başvurusu) Başlangıç */
			if (currentStepId == 10) {
				this.errorState = this.errorControl('kvkk');
				this.errorState = this.errorControl('kullanim_kosullari');
				if (this.errorState) {
					wizardObj.stop();
				} else {
					document.getElementById('icon10').className = 'flaticon-globe iconSuccess';
				}
			} else if (currentStepId == 20) {
				this.errorState = this.errorControl('kabul_kosulu');
				if (this.errorState) {
					wizardObj.stop();
				} else {
					document.getElementById('icon20').className = 'flaticon-list-2 iconSuccess';
				}
			} else if (currentStepId == 30) {
				this.errorState = this.errorControl('merkez_id');
				if (this.errorState) {
					wizardObj.stop();
				} else {
					wizardObj.stop();
					if (this.guncellemeDurum) {
						if (!this.changeControl()) {
							wizardObj.goNext();
						} else {
							this.update()
								.then((est) => {
									console.log('Sonuç', est);
									if ((est.ok) || est) {
										console.log('ileri');
										if (this.hazirlikBasvuruForm.get('ogrenci_basvuru_id').value !== null && this.hazirlikBasvuruForm.get('ogrenci_basvuru_id').value !== '') {
											wizardObj.goNext();
											document.getElementById('icon30').className = 'flaticon-map-location iconSuccess';
											document.getElementById('2icon30').className = 'flaticon2-checkmark iconSuccess';
										}
									}
								})
						}
					} else {
						this.save()
							.then((est) => {
								console.log('Sonuç', est);
								if ((est.ok) || est) {
									console.log('ileri');
									if (this.hazirlikBasvuruForm.get('ogrenci_basvuru_id').value !== null && this.hazirlikBasvuruForm.get('ogrenci_basvuru_id').value !== '') {
										wizardObj.goNext();
										document.getElementById('icon30').className = 'flaticon-map-location iconSuccess';
										document.getElementById('2icon30').className = 'flaticon2-checkmark iconSuccess';
									}
								} else {
									console.log('Wizard -Else- Hata durduruldu.', est);
									wizardObj.stop();
								}
							}).catch((err: any) => {
								console.log('Wizard -Catch- Hata durduruldu.', err);
							});
					}
				}
			} else if (currentStepId == 40) {
				console.log('HAtasııııı', this.hazirlikBasvuruForm);
				this.errorState = this.errorControl('odeme_onay');
				if (this.errorState) {
					wizardObj.stop();
				} else {
					document.getElementById('icon40').className = 'flaticon-responsive iconSuccess';
				}
			}
			/* if (!form.value.kullanim_kosulu_onay || !form.value.kvkk_metni_onay) {
				wizardObj.stop();
				this.isErrorKvkk = true;
				this.isErrorKullanimKosulu = true;
			} 
			if (currentStepId == 20) {
				if (form.value.kayit_turu_id == "") {
					this.isErrorKayitTuru = true;
					this.basvuruForm.controls["kayit_turu_id"].markAsTouched();
					wizardObj.stop();
				}
			}
			*/
			/* Birinci Alan (Sınav Başvurusu) Bitiş*/
			//başvuru sinav merkezleri
			/* if (currentStepId == 30) {
				if (this.basvuruForm.invalid) {

					this.basvuruForm.controls["merkez_id"].markAsTouched();

					wizardObj.stop();
				}
				else {
					wizardObj.stop();
					this.save().then(() => {
						if (this.isAppSucsess) {
							
							wizardObj.goNext();
						}

					}).catch((err: any) => {
						wizardObj.stop();
						
					});
				} 
			}
			if (currentStepId == 40) {
				if (this.data.ucret_odeme_turu == UcretOdemeTuru.dekont) {
					wizardObj.stop();
					this.dekontUpload().then(() => {
						if (this.isDekontSucsess)
							wizardObj.goNext();
					}).catch((err: any) => {
						wizardObj.stop();
					});
				}
			}*/

			/* console.log('Şu an geçilen alan ID-', this.stepsIDList);
			console.log('Şu an geçilen alan ID-', this.stepsIDList[currentStep]);
			console.log('Şu an GELEN alan ID-', this.stepsIDList[currentStep + 1]); */
			nextStepID = Number(this.stepsIDList[currentStep + 1]);
			if (!this.errorState) {
				if (nextStepID === 20) {
					console.log('Girilen IF 20');
					this.hazirlikBasvuruForm.controls['kabul_kosulu'].setValidators([
						Validators.required
					]);
					this.hazirlikBasvuruForm.get('kabul_kosulu').updateValueAndValidity();
				}
				if (nextStepID === 30) {
					console.log('Girilen IF 30');
					this.hazirlikBasvuruForm.controls['merkez_id'].setValidators([
						Validators.required,
						Validators.pattern('[a-zA-Z0-9]{1,4}')
					]);
					this.hazirlikBasvuruForm.get('merkez_id').updateValueAndValidity();
				}
				if (nextStepID === 40) {
					console.log('Girilen IF 40');
					this.hazirlikBasvuruForm.controls['odeme_onay'].setValidators([
						Validators.required,
						Validators.pattern('[1]{1}')
					]);
					this.hazirlikBasvuruForm.get('odeme_onay').updateValueAndValidity();
				}
			}
		});
		wizard.on('beforePrev', (wizardObj) => {
			currentStep = Number(wizardObj.currentStep) - 1;
			currentStepId = Number(wizard.steps[currentStep].id);
			this.stepsIDList.forEach(element => {
				if (currentStepId === Number(element)) {
					if (Number(element) === 20) {
						this.hazirlikBasvuruForm.controls['kabul_kosulu'].clearValidators();
						this.hazirlikBasvuruForm.get('kabul_kosulu').updateValueAndValidity();
						this.errorState = false;
						return false;
					}
					if (Number(element) === 30) {
						this.hazirlikBasvuruForm.controls['merkez_id'].clearValidators();
						this.hazirlikBasvuruForm.get('merkez_id').updateValueAndValidity();
						this.errorState = false;
						return false;
					}
					if (Number(element) === 40) {
						this.hazirlikBasvuruForm.controls['odeme_onay'].clearValidators();
						this.hazirlikBasvuruForm.get('odeme_onay').updateValueAndValidity();
						this.errorState = false;
						return false;
					}
				}
			});

		});
		// Change event
		wizard.on('change', () => {
			setTimeout(() => {
				KTUtil.scrollTop();
			}, 500);
		});
	}
	ngOnInit(): void {
		console.log('dialog gelen data', this.data);
		if (this.data.kabulKosullari.result) {
			this.kabulKosulVerileri = this.data.sinavBilgileri.data;
			this.bilgiDurum = false;
		} else {
			this.bilgiDurum = true;
			this.bilgiMesaj = this.translate.instant("TEXT.SINAV_MERKEZ_EKSIK");
		}
		if (this.data.sinavMerkezleri.result) {
			this.sinavMerkezVerileri = this.data.sinavBilgileri.data;
			this.bilgiDurum = false;
		} else {
			this.bilgiDurum = true;
			this.bilgiMesaj = this.translate.instant("TEXT.BASVURU_BILGILERI_EKSIK");
		}

		if (this.data.sinavBilgileri.result) {
			this.sinavVerileri = this.data.sinavBilgileri.data;
			this.bilgiDurum = false;
		} else {
			this.bilgiDurum = true;
			this.bilgiMesaj = this.translate.instant("TEXT.BASVURU_BILGILERI_EKSIK");
		}

		if (!this.bilgiDurum) {
			this.formInit();

			var dataOdeme = {
				token: this.identityStudentService.get(),
				birimUid: this.localStorageService.getItem("apiSetting").birim_uid,
				basvuruId: this.sinavVerileri.basvuru_id,
				dil: this.localStorageService.getItem("language")
			}
			var deger = this.dokoSettingsService.apiUrl + dataOdeme.token + "/" + dataOdeme.birimUid + "/" + dataOdeme.basvuruId + "/" + dataOdeme.dil;
			this.posOdemeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(deger);
			console.log('POS', this.posOdemeUrl);
		}
	}

	/*--------------------------------------[RC]--------------------------------------
	******************************* Düzenleme Başlangıç ******************************
	--------------------------------------[RC]--------------------------------------*/
	formInit() {
		this.hazirlikBasvuruForm.get('basvuru_id').setValue(this.sinavVerileri.basvuru_id);

		if (this.sinavVerileri.ogrenci_basvuru_id) {
			this.guncellemeDurum = true;
			this.hazirlikBasvuruForm.get("ogrenci_basvuru_id").setValue(this.sinavVerileri.ogrenci_basvuru_id);
			this.hazirlikBasvuruForm.get("kvkk").setValue(true);
			this.hazirlikBasvuruForm.get("kullanim_kosullari").setValue(true);
			this.hazirlikBasvuruForm.get("kabul_kosulu").setValue(this.sinavVerileri.kabul_kosulu);
			this.hazirlikBasvuruForm.get("merkez_id").setValue(this.sinavVerileri.merkez_id);
			this.hazirlikBasvuruForm.get("odeme_onay").setValue(this.sinavVerileri.odeme_onay);
		} else {
			this.guncellemeDurum = false;
		}
		console.log('Form son hali', this.hazirlikBasvuruForm.value);

		/*if (this.data.ogrenci_basvuru_id) {
			this.hazirlikBasvuruForm.get("merkez_id").setValue(this.data.sinavBilgileri.data.ogrenci_basvuru_sinav_merkez_id);
			this.hazirlikBasvuruForm.get("kullanim_kosulu_onay").setValue(true);
			this.hazirlikBasvuruForm.get("kvkk_metni_onay").setValue(true);
			this.hazirlikBasvuruForm.get("kullanim_kosullari").setValue(this.data.sinavBilgileri.data.kayit_turu_id);
		}
		 this.basvuruForm = this.fb.group({
			merkez_id: ["", Validators.compose([Validators.required])],
			kullanim_kosulu_onay: [""],
			kvkk_metni_onay: [""],
			kayit_turu_id: ["", Validators.compose([Validators.required])]
		});
		this.dekontUploadForm = this.fb.group({
			dekont: ["", Validators.compose([Validators.required])],
			ogrenci_basvuru_id: [""]
		});
		if (this.data.ogrenci_basvuru_id) {
			this.basvuruForm.get("merkez_id").setValue(this.data.ogrenci_basvuru_sinav_merkez_id);
			this.basvuruForm.get("kullanim_kosulu_onay").setValue(true);
			this.basvuruForm.get("kvkk_metni_onay").setValue(true);
			this.basvuruForm.get("kayit_turu_id").setValue(this.data.kayit_turu_id);
		} */
	}
	/* getKabulKosullari() {
		this.studentService
			.applicationTypeGetList(BasvuruTurEnum.sinav)
			.subscribe(res => {
				if (res.result) {
					this.kabulKosul = true;
					this.kabulKosullari = res.data;
				} else {
					this.kabulKosul = false;
					this.data.kayit_turu_durumu = 0;
				}
			})
	}
	getSinavMerkezleri() {
		this.studentService
			.exam_place_get_list(this.data.basvuru_id)
			.subscribe(res => {
				if (res.result) {
					this.sinavMerkezi = true;
					this.aktifSinavMerkezleri = res.data;
				} else {
					this.sinavMerkezi = false;
				}
			})
	} */
	inputChange($event, $type) {
		if ($event.target.checked) {
			let text = this.sinavVerileri[$type];
			this.openModal(text, $type);
		}
	}
	errorControl(input: string): any {
		let result = this.errorService.errorControl(input, this.hazirlikBasvuruForm);

		if (input === '*') {
			this.errorState = result;
		} else {
			console.log('errorControl -------------Başlangıç---------------');
			console.log('errorControl -------------input-', input);
			console.log('errorControl -------------result-', result);
			if (input === '*') {
				this.errorState = result;
			} else {
				return result;
			}
			/* if (result) {
				this.errorState = true;
				return result;
			}
			this.errorState = false; */

			console.log('errorControl -------------Bitiş---------------');
		}
	}
	changeControl(): boolean {
		let change: boolean = false;
		Object.keys(this.hazirlikBasvuruForm.controls).forEach(key => {
			if (!change) {
				if (key !== 'ogrenci_basvuru_id' && key !== 'basvuru_id' && key !== 'kvkk' && key !== 'kullanim_kosullari') {
					console.log(key + ' : - Önceki veri:' + this.data.sinavBilgileri.data[key] + ' sonraki veri: ' + this.hazirlikBasvuruForm.get(key).value);
					if (this.data.sinavBilgileri.data[key] !== this.hazirlikBasvuruForm.get(key).value) {
						change = true;
						return false;
					}
				}
			}
		});
		return change;
	}
	save(): any {
		return new Promise((resolve, reject) => {
			this.errorControl("*");
			if (this.errorState == false) {
				this.studentService
					.sinavBasvuruKaydet(this.hazirlikBasvuruForm.value)
					.subscribe(res => {
						console.log('Sınav başvuru kayıt sonrası', res);
						if (res.result) {
							Swal.fire({
								text: this.translate.instant('TEXT.SAVE_SUCCESSFUL'),
								icon: 'success',
								showConfirmButton: false,
								timer: 2500
							});
							this.hazirlikBasvuruForm.get('ogrenci_basvuru_id').setValue(res.data.ogrenci_basvuru_id);
							setTimeout(() => {
								resolve(true);
							}, 3000)
						} else {
							Swal.fire({
								text: this.translate.instant("TEXT.OPERATION_FAILED"),
								html: this.errorService.arrayError(res.error.message),
								icon: 'error',
								showConfirmButton: true
							});
							reject(false);
						}
					}, err => {
						Swal.fire({
							title: this.translate.instant("TEXT.OPERATION_FAILED"),
							text: err,
							icon: 'error',
							showConfirmButton: false,
							timer: 1500
						});
						reject(false);
					});
			}
		})
	}
	update(): any {
		return new Promise((resolve, reject) => {
			this.errorControl("*");
			if (this.errorState == false) {
				this.studentService
					.sinavBasvuruKaydet(this.hazirlikBasvuruForm.value)
					.subscribe(res => {
						console.log('Sınav başvuru güncelleme sonrası', res);
						if (res.result) {
							Swal.fire({
								text: this.translate.instant('TEXT.UPDATE_SUCCESSFUL'),
								icon: 'success',
								showConfirmButton: false,
								timer: 2500
							});
							setTimeout(() => {
								resolve(true);
							}, 3000)
						} else {
							Swal.fire({
								text: this.translate.instant("TEXT.OPERATION_FAILED"),
								html: this.errorService.arrayError(res.error.message),
								icon: 'error',
								showConfirmButton: true
							});
							reject(false);
						}
					}, err => {
						Swal.fire({
							title: this.translate.instant("TEXT.OPERATION_FAILED"),
							text: err,
							icon: 'error',
							showConfirmButton: false,
							timer: 1500
						});
						reject(false);
					});
			}
		})
	}
	basvuruCompleted() {
		this.studentService
			.approve_application(this.hazirlikBasvuruForm.get('ogrenci_basvuru_id').value, this.hazirlikBasvuruForm.get('basvuru_id').value)
			.subscribe(res => {
				if (res.result) {
					this.dialogRef.close();
					Swal.fire({
						title: this.translate.instant("TEXT.ExamApplicationSuccess"),
						text: "başarılı",
						icon: 'success',
						showConfirmButton: false,
						timer: 2500
					});
				}
				else {
					Swal.fire({
						title: this.translate.instant("TEXT.OPERATION_FAILED"),
						text: "başarısız",
						icon: 'error',
						showConfirmButton: false,
						timer: 1500
					});

				}
			});
	}
	/* save(): any {
		return new Promise((resolve, reject) => {
			//if (this.isAppSucsess) return; // bir kerei kayıt yaptıysa bir daha yapmaması için;
			//var data = '';//this.basvuruForm.value;
			let postData: any;
			/* if (this.data.ogrenci_basvuru_id) {
				var updateData = {
					merkez_id: this.data.merkez_id,
					basvuru_id: this.data.basvuru_id,
					ogrenci_basvuru_id: this.data.ogrenci_basvuru_id,
					kayit_turu_id: this.data.kayit_turu_id
				};
				postData = updateData;

			} else { 
			var body = {
				merkez_id: this.data.merkez_id,
				basvuru_id: this.data.basvuru_id,
				kayit_turu_id: this.data.kayit_turu_id
			};
			postData = body;
			//}
			this.studentService
				.sinavBasvuruKaydet(postData)
				.subscribe(res => {
					if (res.result) {
						this.isAppSucsess = true;
						this.data.ogrenci_basvuru_id = res.data.ogrenci_basvuru_id;
						setTimeout(() => {
							resolve(true);
						}, 3000)
					}
					else {
						reject(true);
						Swal.fire({
							text: this.translate.instant("TEXT.OPERATION_FAILED"),
							icon: 'error',
							showConfirmButton: false,
							timer: 2500
						});
					}
				}, err => {
					Swal.fire({
						title: this.translate.instant("TEXT.OPERATION_FAILED"),
						text: "başarısız",
						icon: 'error',
						showConfirmButton: false,
						timer: 1500
					});

				});
		})
	} */

	/*--------------------------------------[RC]--------------------------------------
	******************************** Düzenleme Bitiş *********************************
	--------------------------------------[RC]--------------------------------------*/

	/* getKabulMetinleri() {
		this.studentService
			.applicationTypeGetList(BasvuruTurEnum.sinav)
			.subscribe(res => {
				

				if (res.result) {
					this.kabulMetinleri = res.data;
				}
			})
	} */
	objectSanalPostOdeme() {
		return Object.keys(this.sanalPosModel);

	}

	isAppSucsess = false;
	/* save(): any {

		return new Promise((resolve, reject) => {
			//if (this.isAppSucsess) return; // bir kerei kayıt yaptıysa bir daha yapmaması için;

			var data = '';//this.basvuruForm.value;
			let postData: any;
			if (this.data.ogrenci_basvuru_id) {
				var updateData = {
					merkez_id: data.merkez_id,
					basvuru_id: this.data.basvuru_id,
					ogrenci_basvuru_id: this.data.ogrenci_basvuru_id,
					kayit_turu_id: data.kayit_turu_id
				};
				postData = updateData;

			}
			else {
				var body = {
					merkez_id: data.merkez_id,
					basvuru_id: this.data.basvuru_id,
					kayit_turu_id: data.kayit_turu_id
				};
				postData = body;



			}

			this.studentService.sinavBasvuruKaydet(postData).subscribe(res => {
				
				if (res.result) {
					this.isAppSucsess = true;

					this.data.ogrenci_basvuru_id = res.data.ogrenci_basvuru_id;

					
				}

				else {
					reject(true);
					Swal.fire({
						text: this.translate.instant("TEXT.OPERATION_FAILED"),
						icon: 'error',
						showConfirmButton: false,
						timer: 2500


					});
				}

			}, err => {

				Swal.fire({
					title: this.translate.instant("TEXT.OPERATION_FAILED"),
					text: "başarısız",
					icon: 'error',
					showConfirmButton: false,
					timer: 1500
				});

			})


			setTimeout(() => {
				resolve(true);
			}, 3000);
		})
	}

	basvuruCompleted() {
		this.studentService
			.approve_application(this.data.ogrenci_basvuru_id, this.data.basvuru_id)
			.subscribe(res => {
				if (res.result) {
					this.dialogRef.close();
					Swal.fire({
						title: this.translate.instant("TEXT.ExamApplicationSuccess"),
						text: "başarılı",
						icon: 'success',
						showConfirmButton: false,
						timer: 2500
					});
				}
				else {
					Swal.fire({
						title: this.translate.instant("TEXT.OPERATION_FAILED"),
						text: "başarısız",
						icon: 'error',
						showConfirmButton: false,
						timer: 1500
					});

				}
			});


	}
 */
	//

	changeStatu(event: any) {

	}

	isDekontSucsess = false;
	dekontUpload() {

		var promise = new Promise((resolve, reject) => {


			if (!this.isDekontSucsess) {


				var dekontModel = this.dekontUploadForm.value;

				if (!dekontModel.dekont && this.data.ogrenci_basvuru_dekont)//dekont var ama güncelleme yapmak istemiyor.
				{


					this.isDekontSucsess = true;

					return setTimeout(() => {
						resolve(true);
					}, 100);

				}
				dekontModel.ogrenci_basvuru_id = this.data.ogrenci_basvuru_id;
				this.studentService.uploadExamDekont(dekontModel).subscribe(res => {

					if (res.result) {
						this.isDekontSucsess = true;
						setTimeout(() => {
							resolve(true);
						}, 3000);
					}
				})

			}


		})


		return promise;

	}
	/* isCexkBoxContorl(controlName: string, validationType: string): boolean {
		const control = '';//this.basvuruForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = !control.value && (control.dirty || control.touched);
		return result;
	}

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = '';//this.basvuruForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
 */



	openModal(text: any, titleType: string) {

		var title = this.translate.instant("TEXT." + titleType);
		var data = { text: text, title: title }
		const dialogRef = this.dialog.open(TextDisplayComponent, { data, width: "40%", minWidth: "310px", height: "75%", maxHeight: "500px" });

		dialogRef.afterClosed().subscribe(refData => {

			/* if (sayi == 1) {
				this.basvuruForm.get("kvkk_metni_onay").setValue(true)
			}
			if (sayi == 2) {
				this.basvuruForm.get("kullanim_kosulu_onay").setValue(true);
			} */
			/* if (this.basvuruForm.get("kvkk_metni_onay").value) this.isErrorKvkk = false;
			if (this.basvuruForm.get("kullanim_kosulu_onay").value) this.isErrorKullanimKosulu = false; */

			if (!refData) {
				//burada modal kapanıyor
				return;
			}

		});
	}


	radioChange() {
		this.isErrorKayitTuru = false;
	}




}
