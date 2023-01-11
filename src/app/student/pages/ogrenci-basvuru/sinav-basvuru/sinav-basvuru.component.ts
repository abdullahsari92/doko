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
import { apiSetting } from '../../../../../../src/app/core/models/apiSetting';
import { fieldValidations } from '../../../../core/Enums/fieldValidations';
import { BasvuruGoruntulemeComponent } from '../../ogrenci-basvuru/basvuru-goruntuleme/basvuru-goruntuleme.component';


@Component({
	selector: 'kt-sinav-basvuru',
	templateUrl: './sinav-basvuru.component.html',
	styleUrls: [
		'./sinav-basvuru.component.scss',
	]
})
export class SinavBasvuruComponent implements OnInit {
	//Diziler Başlangıç
	public sinavVerileri: any;
	public kabulKosulVerileri: any;
	public sinavMerkezVerileri: any;
	public posOdemeUrl: any;
	public secilenKabulMetin: any;
	//Diziler Bitiş

	//Tanımlar Başlangıç
	public bilgiDurum: boolean = false;
	public guncellemeDurum: boolean = false;
	public bilgiMesaj: string;
	ifIframePos: boolean = false;
	isErrorKayitTuru: boolean;
	isErrorKullanimKosulu: boolean;
	public errorState: boolean = false;
	sanalPosModel: sanalPosModel = new sanalPosModel();
	//Tanımlar Bitiş

	//Enum Durumlar Başlangıç
	validations = fieldValidations;
	ucretOdemeTuru = UcretOdemeTuru;
	ucretOdemeZamani = UcretOdemeZamani;
	ogrenciBasvuruDurumEnum = OgrenciBasvuruDurumEnum;
	apiSetting: apiSetting = new apiSetting();
	//Enum Durumlar Bitiş

	//Formlar Başlangıç
	sinavBasvuruForm = new FormGroup({
		ogrenci_basvuru_id: new FormControl(''),
		basvuru_id: new FormControl(''),
		kullanim_kosullari: new FormControl('', [
			Validators.requiredTrue
		]),
		kabul_kosulu: new FormControl(''),
		merkez_id: new FormControl('', [
			/* Validators.required,
			Validators.pattern('[a-zA-Z0-9]{1}') */
		]),
		odeme_onay: new FormControl(''),
		iptal_iade_kosullari: new FormControl(''),
		dekont: new FormControl(''),
		onay: new FormControl(''),
		raporlar: new FormControl('')
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
			startStep: 1,
			clickableSteps: false
		});
		wizard.steps.forEach(element => {
			this.stepsIDList.push(element.id);
		});
		var currentStep;
		var currentStepId;
		var nextStepID;

		if (this.guncellemeDurum) {
			document.getElementById('icon10').className = 'flaticon-globe iconSuccess';
			if (this.data.kabulKosullari.result) {
				document.getElementById('icon20').className = 'flaticon-list-2 iconSuccess';
			}
			document.getElementById('icon30').className = 'flaticon-map-location iconSuccess';
			document.getElementById('2icon30').className = 'flaticon2-checkmark iconSuccess';
		}
		if (this.guncellemeDurum && (this.sinavVerileri.ucret_odeme_turu == 1)) {
			if ((this.sinavBasvuruForm.get('odeme_onay').value !== null && this.sinavBasvuruForm.get('odeme_onay').value == 1)) {
				this.sinavBasvuruForm.get('iptal_iade_kosullari').setValue(true);
				this.ifIframePos = true;
				document.getElementById('icon40').className = 'flaticon-globe iconSuccess';
				this.cdr.detectChanges();
			}
		} else {
			if (this.guncellemeDurum && this.sinavBasvuruForm.get('dekont').value !== null) {
				document.getElementById('icon40').className = 'flaticon-globe iconSuccess';
			}
		}

		wizard.on('beforeNext', (wizardObj) => {

			//const form = this.basvuruForm as FormGroup;
			currentStep = wizardObj.currentStep - 1;
			currentStepId = wizard.steps[currentStep].id;
			/* Birinci Alan (Sınav Başvurusu) Başlangıç */
			if (currentStepId == 10) {
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

									if ((est.ok) || est) {

										if (this.sinavBasvuruForm.get('ogrenci_basvuru_id').value !== null && this.sinavBasvuruForm.get('ogrenci_basvuru_id').value !== '') {
											wizardObj.goNext();
											document.getElementById('icon30').className = 'flaticon-map-location iconSuccess';
											document.getElementById('2icon30').className = 'flaticon2-checkmark iconSuccess';
										}
									}
								});
						}
					} else {
						if (this.sinavBasvuruForm.get('ogrenci_basvuru_id').value !== null && this.sinavBasvuruForm.get('ogrenci_basvuru_id').value !== '') {
							document.getElementById('icon30').className = 'flaticon-map-location iconSuccess';
							document.getElementById('2icon30').className = 'flaticon2-checkmark iconSuccess';
							wizardObj.goNext();
						} else {
							this.save().then(
								() => {
									if (this.sinavBasvuruForm.get('ogrenci_basvuru_id').value !== null && this.sinavBasvuruForm.get('ogrenci_basvuru_id').value !== '') {
										document.getElementById('icon30').className = 'flaticon-map-location iconSuccess';
										document.getElementById('2icon30').className = 'flaticon2-checkmark iconSuccess';
										wizardObj.goNext();
									}
								},
								() => {
									wizardObj.stop();
								}
							);
						}
					}
				}
			} else if (currentStepId == 40) {
				if (this.odemeDurumu() == 1) {
					console.log('Form', this.sinavBasvuruForm);
					wizardObj.stop();
					this.errorState = this.errorControl('iptal_iade_kosullari');
					this.errorState = this.errorControl('odeme_onay');
					this.odemeKontrol().then(
						() => {
							this.errorState = this.errorControl('iptal_iade_kosullari');
							this.errorState = this.errorControl('odeme_onay');
							if (this.errorState) {
								wizardObj.stop();
							} else {
								document.getElementById('icon40').className = 'flaticon-responsive iconSuccess';
								wizardObj.goTo(5);
							}
						},
						() => {
							wizardObj.stop();
						}
					);
				} else {
					this.errorState = this.errorControl('dekont');
					if (this.errorState) {
						wizardObj.stop();
					} else {
						wizardObj.stop();
						if (!this.changeControl('dekont')) {
							wizardObj.goNext();
						} else {
							this.dekontUpload().then(
								() => {
									document.getElementById('icon40').className = 'flaticon-responsive iconSuccess';
									wizardObj.goNext();
								},
								() => {
									wizardObj.stop();
								}
							);
						}

					}
				}

			}

			nextStepID = Number(this.stepsIDList[currentStep + 1]);

			if (!this.errorState) {
				if (nextStepID === 20) {

					this.sinavBasvuruForm.controls['kabul_kosulu'].setValidators([
						Validators.required
					]);
					this.sinavBasvuruForm.get('kabul_kosulu').updateValueAndValidity();
				}
				if (nextStepID === 30) {

					this.sinavBasvuruForm.controls['merkez_id'].setValidators([
						Validators.required,
						Validators.pattern('[a-zA-Z0-9]{1,4}')
					]);
					this.sinavBasvuruForm.get('merkez_id').updateValueAndValidity();
				}
				if (nextStepID === 40) {
					if (this.odemeDurumu() == 1) {
						this.sinavBasvuruForm.controls['iptal_iade_kosullari'].setValidators([
							Validators.requiredTrue
						]);
						this.sinavBasvuruForm.get('iptal_iade_kosullari').updateValueAndValidity();
						this.sinavBasvuruForm.controls['odeme_onay'].setValidators([
							Validators.required,
							Validators.pattern('[1]{1}')
						]);

						this.sinavBasvuruForm.get('odeme_onay').updateValueAndValidity();
					} else {
						this.sinavBasvuruForm.controls['dekont'].setValidators([
							Validators.required
						]);
						this.sinavBasvuruForm.get('dekont').updateValueAndValidity();
					}
				}
			}
		});
		wizard.on('beforePrev', (wizardObj) => {
			currentStep = Number(wizardObj.currentStep) - 1;
			currentStepId = Number(wizard.steps[currentStep].id);
			this.stepsIDList.forEach(element => {
				if (currentStepId === Number(element)) {
					if (Number(element) === 20) {
						this.sinavBasvuruForm.controls['kabul_kosulu'].clearValidators();
						this.sinavBasvuruForm.get('kabul_kosulu').updateValueAndValidity();
						this.errorState = false;
						return false;
					}
					if (Number(element) === 30) {
						this.sinavBasvuruForm.controls['merkez_id'].clearValidators();
						this.sinavBasvuruForm.get('merkez_id').updateValueAndValidity();
						this.errorState = false;
						return false;
					}
					if (Number(element) === 40) {
						if (this.odemeDurumu() == 1) {
							this.sinavBasvuruForm.controls['odeme_onay'].clearValidators();
							this.sinavBasvuruForm.get('odeme_onay').updateValueAndValidity();
							this.sinavBasvuruForm.controls['iptal_iade_kosullari'].clearValidators();
							this.sinavBasvuruForm.get('iptal_iade_kosullari').updateValueAndValidity();
						} else {
							this.sinavBasvuruForm.controls['dekont'].clearValidators();
							this.sinavBasvuruForm.get('dekont').updateValueAndValidity();
						}
						this.errorState = false;
						return false;
					}
					if (Number(element) === 50) {
						this.sinavBasvuruForm.controls['onay'].clearValidators();
						this.sinavBasvuruForm.get('onay').updateValueAndValidity();
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
		this.apiSetting = this.localStorageService.getItem("apiSetting") as apiSetting;
		if (this.data.basvuruBilgileri.result) {
			this.sinavVerileri = this.data.basvuruBilgileri.data;
			if (this.data.sinavMerkezleri.result) {
				this.sinavMerkezVerileri = this.data.sinavMerkezleri.data;
				if (this.sinavVerileri.kayit_turu_durumu) {
					if (this.data.kabulKosullari.result) {
						this.kabulKosulVerileri = this.data.kabulKosullari.data;
						this.bilgiDurum = false;
					} else {
						this.kabulKosulVerileri = false;
						this.bilgiDurum = true;
						this.bilgiMesaj = this.translate.instant("TEXT.KABUL_KOSUL_EKSIK");
					}
				}
			} else {
				this.bilgiDurum = true;
				this.bilgiMesaj = this.translate.instant("TEXT.SINAV_MERKEZ_EKSIK");
			}
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
		}
	}
	formInit() {
		this.sinavBasvuruForm.get('basvuru_id').setValue(this.sinavVerileri.basvuru_id);
		this.sinavBasvuruForm.get("raporlar").setValue(this.sinavVerileri.raporlar);

		if (this.sinavVerileri.ogrenci_basvuru_id) {
			this.guncellemeDurum = true;
			//this.ifIframePos = true;
			this.sinavBasvuruForm.get("ogrenci_basvuru_id").setValue(this.sinavVerileri.ogrenci_basvuru_id);
			this.sinavBasvuruForm.get("kullanim_kosullari").setValue(true);
			this.sinavBasvuruForm.get("kabul_kosulu").setValue(this.sinavVerileri.kabul_kosulu);
			this.sinavBasvuruForm.get("merkez_id").setValue(this.sinavVerileri.merkez_id);
			this.sinavBasvuruForm.get("odeme_onay").setValue(this.sinavVerileri.odeme_onay);
			this.sinavBasvuruForm.get("dekont").setValue(this.sinavVerileri.ogrenci_basvuru_dekont);
		} else {
			this.guncellemeDurum = false;
			//this.ifIframePos = false;
		}

	}
	inputChange($event, $type) {
		if ($event.target.checked) {
			if ($type == 'onay') {
				this.sinavBasvuruForm.get("onay").setValue(true);
			} else {
				let text = this.sinavVerileri[$type];
				this.openModal(text, $type);
			}
		}
	}
	errorControl(input: string): any {

		let result = this.errorService.errorControl(input, this.sinavBasvuruForm);

		if (input === '*') {
			this.errorState = result;
		} else {


			if (input === '*') {
				this.errorState = result;
			} else {
				return result;
			}
		}
	}
	changeControl(paramt?): boolean {
		let change: boolean = false;
		if (paramt == undefined) {
			Object.keys(this.sinavBasvuruForm.controls).forEach(key => {
				if (!change) {
					if (!this.sinavBasvuruForm.get(key).pristine) {
						change = true;
						return false;
					}
				}
			});
		} else {
			change = (!this.sinavBasvuruForm.get(paramt).pristine) ? true : false;
		}

		return change;
	}
	openModal(text: any, titleType: string) {
		var title = this.translate.instant("TEXT." + titleType);
		var data = { text: text, title: title }
		const dialogRef = this.dialog.open(TextDisplayComponent, { data, width: "40%", minWidth: "310px", height: "75%", maxHeight: "500px" });
		dialogRef.afterClosed().subscribe(rest => {
			this.sinavBasvuruForm.get("kullanim_kosullari").setValue(true);
		});
	}
	iptalIadeUrl() {
		window.open(this.apiSetting['iptal_iade_kosullari_url'], "_blank");
		this.sinavBasvuruForm.get("iptal_iade_kosullari").setValue(true);
		this.ifIframePos = true;
	}
	odemeKontrol(): any {
		console.log('odemeKontrol');
		let promise = new Promise((resolve, reject) => {
			this.studentService
				.getSinavBasvuruDetay(this.sinavBasvuruForm.get('basvuru_id').value, 1)
				.subscribe(res => {
					console.log('odemeKontrol', res);
					if (res.result) {
						if ((res.data.basvuruBilgileri.data.odeme_onay) && (res.data.basvuruBilgileri.data.odeme_tarihi) !== null) {
							console.log("içeride");
							this.sinavBasvuruForm.get('odeme_onay').setValue(1);
							setTimeout(() => {
								resolve(true);
							}, 1000);
						} else {
							setTimeout(() => {
								reject();
							}, 1000);
						}
					}
				});
		});
		return promise;
	}
	save(): any {
		let promise = new Promise((resolve, reject) => {
			this.errorControl("*");
			if (this.errorState == false) {
				this.studentService
					.sinavBasvuruKaydet(this.sinavBasvuruForm.value)
					.subscribe(res => {
						if (res.result) {
							Swal.fire({
								text: this.translate.instant('TEXT.SAVE_SUCCESSFUL'),
								icon: 'success',
								showConfirmButton: false,
								timer: 2500
							});
							this.sinavBasvuruForm.get('ogrenci_basvuru_id').setValue(res.data.ogrenci_basvuru_id);
							//this.guncellemeDurum = true;
							setTimeout(() => {
								resolve(true);
							}, 1000);
							//}
						} else {
							Swal.fire({
								text: this.translate.instant("TEXT.OPERATION_FAILED"),
								html: this.errorService.arrayError(res.error.message),
								icon: 'error',
								showConfirmButton: true
							});
							setTimeout(() => {
								reject();
							}, 1000);
						}
					}, err => {
						Swal.fire({
							title: this.translate.instant("TEXT.OPERATION_FAILED"),
							icon: 'error',
							showConfirmButton: true
						});
					});
			}
		});
		return promise;
	}
	update(): any {
		let promise = new Promise((resolve, reject) => {
			this.errorControl("*");
			if (this.errorState == false) {
				this.studentService
					.sinavBasvuruKaydet(this.sinavBasvuruForm.value)
					.subscribe(res => {
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
		});
		return promise;
	}
	dekontUpload(): any {
		let promise = new Promise((resolve, reject) => {
			this.studentService
				.uploadExamDekont(this.sinavBasvuruForm.value)
				.subscribe(res => {

					if (res.result) {
						Swal.fire({
							title: this.translate.instant('TEXT.UPDATE_SUCCESSFUL'),
							icon: 'success',
							showConfirmButton: false,
							timer: 2500
						});
						setTimeout(() => {
							resolve(true);
						}, 1000);
					} else {
						Swal.fire({
							title: this.translate.instant("TEXT.OPERATION_FAILED"),
							html: this.translate.instant(res['message']),
							icon: 'error',
							showConfirmButton: true
						});
						setTimeout(() => {
							reject();
						}, 1000);
					}
				}, err => {
					Swal.fire({
						title: this.translate.instant("TEXT.OPERATION_FAILED"),
						text: err,
						icon: 'error',
						showConfirmButton: false,
						timer: 1500
					});
					setTimeout(() => {
						reject();
					}, 1000);
				});
		});
		return promise;
	}
	basvuruTamamla() {
		this.sinavBasvuruForm.controls['onay'].setValidators([
			Validators.requiredTrue
		]);
		this.sinavBasvuruForm.get('onay').updateValueAndValidity();
		this.errorControl("*");
		if (this.errorState == false) {
			this.studentService
				.approve_application(this.sinavBasvuruForm.get('ogrenci_basvuru_id').value, this.sinavBasvuruForm.get('basvuru_id').value)
				.subscribe(res => {
					console.log('-*-', res);
					if (res.result) {
						Swal.fire({
							text: this.translate.instant('TEXT.ExamApplicationSuccess'),
							icon: 'success',
							showConfirmButton: false,
							timer: 2500
						});
						this.dialogRef.close();
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
	}
	odemeDurumu(): any {
		if (this.sinavVerileri.ucret_odeme_turu == this.ucretOdemeTuru.odeme_istenmiyor) {
			return false;
		} else {
			if (this.sinavVerileri.ucret_zamani == this.ucretOdemeZamani.sinavdan_sonra) {
				return false;
			} else {
				if (this.sinavVerileri.ucret_zamani == this.ucretOdemeZamani.sinavdan_once && this.sinavVerileri.ucret_odeme_turu == this.ucretOdemeTuru.online) {
					return 1;
				}
				if (this.sinavVerileri.ucret_zamani == this.ucretOdemeZamani.sinavdan_once && this.sinavVerileri.ucret_odeme_turu == this.ucretOdemeTuru.dekont) {
					return 2;
				}
			}
		}

	}
	viewModal() {
		console.log('*0*', this.sinavBasvuruForm.value);
		const dialogRef = this.dialog.open(BasvuruGoruntulemeComponent, {
			data: this.sinavBasvuruForm.value,
			width: "65%",
			minWidth: "350px",
			height: "85%",
			maxHeight: "700px"
		});
		dialogRef.afterClosed().subscribe(refData => {
			if (!refData) {
				return;
			}
		});
	}
}
