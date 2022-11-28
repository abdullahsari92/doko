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
import { OgrenciBasvuruDurumEnum } from '../../../../core/Enums/OgrenciBasvuruDurum.enum';
import { UcretOdemeTuru, UcretOdemeZamani } from '../../../../core/Enums/ucret-odeme.enum';
import { IdentityStudentService } from '../../../../student/services/identity-student.service';
import { fieldValidations } from '../../../../core/Enums/fieldValidations';
import { apiSetting } from '../../../../../../src/app/core/models/apiSetting';
import { BasvuruGoruntulemeComponent } from '../../ogrenci-basvuru/basvuru-goruntuleme/basvuru-goruntuleme.component';
import { result } from 'lodash';

@Component({
	selector: 'kt-lisans-basvuru',
	templateUrl: './lisans-basvuru.component.html',
	styleUrls: [
		'./lisans-basvuru.component.scss',
	]
})

export class LisansBasvuruComponent implements OnInit {
	//Diziler Başlangıç
	public basvuruVerileri: any;
	public vizeVerileri: any = {
		'vize_durumu': 0,
		'vize_ulke_kodu': null,
		'vize_konsolosluk_kodu': null
	};
	public kabulKosulVerileri: any;
	public posOdemeUrl: any;
	public secilenKabulMetin: any;
	//Diziler Bitiş

	//Bağlı Durumlar Başlangıç
	public bilgiDurum: boolean = false;
	public guncellemeDurum: boolean = false;
	public bilgiMesaj: string;
	ifIframePos: boolean = false;
	isErrorKayitTuru: boolean;
	isErrorKullanimKosulu: boolean;
	public errorState: boolean = false;
	sanalPosModel: sanalPosModel = new sanalPosModel();
	//Bağlı Durumlar Bitiş

	//Enum Durumlar Başlangıç
	validations = fieldValidations;
	ucretOdemeTuru = UcretOdemeTuru;
	ucretOdemeZamani = UcretOdemeZamani;
	ogrenciBasvuruDurumEnum = OgrenciBasvuruDurumEnum;
	apiSetting: apiSetting = new apiSetting();
	//Enum Durumlar Bitiş

	//Formlar Başlangıç
	basvuruForm = new FormGroup({
		ogrenci_basvuru_id: new FormControl(''),
		basvuru_id: new FormControl(''),
		kullanim_kosullari: new FormControl('', [
			Validators.requiredTrue
		]),
		kabul_kosulu: new FormControl(''),
		lise_bilgileri: new FormControl(''),
		dil_bilgileri: new FormControl(''),
		vize_durumu: new FormControl(null),
		vize_ulke_kodu: new FormControl(''),
		vize_konsolosluk_kodu: new FormControl(''),
		tercih_bilgisi: new FormControl(''),
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
			document.getElementById('icon10').className = 'flaticon-globe iconSuccess icon-2x';

			if (this.data.basvuruBilgileri.data.kayit_turu_durumu) {
				document.getElementById('icon20').className = 'flaticon-list-2 iconSuccess icon-2x';
			}

			if (this.data.basvuruBilgileri.data.vize_bilgisi_durumu) {
				document.getElementById('icon30').className = 'flaticon2-writing iconSuccess icon-2x';
			}

			document.getElementById('icon40').className = 'flaticon-map-location iconSuccess icon-2x';
			document.getElementById('2icon40').className = 'flaticon2-checkmark iconSuccess icon-2x';

			if (this.data.basvuruBilgileri.data.dil_bilgisi_durumu && this.data.dilBilgileri.result) {
				document.getElementById('icon50').className = 'flaticon2-chat-2 iconSuccess icon-2x';
			}

			if (this.data.tercihBilgileri.result) {
				document.getElementById('icon70').className = 'flaticon-list iconSuccess icon-2x';
			}


		}
		if (this.guncellemeDurum && (this.basvuruVerileri.ucret_odeme_turu == 1)) {
			if ((this.basvuruForm.get('odeme_onay').value !== null && this.basvuruForm.get('odeme_onay').value == 1)) {
				this.basvuruForm.get('iptal_iade_kosullari').setValue(true);
				this.ifIframePos = true;
				document.getElementById('icon80').className = 'flaticon-coins icon-2x iconSuccess';
				this.cdr.detectChanges();
			}
		} else {
			if (this.guncellemeDurum && this.basvuruForm.get('dekont').value !== null) {
				document.getElementById('icon80').className = 'flaticon-coins icon-2x iconSuccess';
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
					document.getElementById('icon10').className = 'flaticon-globe icon-2x';
					wizardObj.stop();
				} else {
					document.getElementById('icon10').className = 'flaticon-globe iconSuccess icon-2x';
				}
			} else if (currentStepId == 20) {
				this.errorState = this.errorControl('kabul_kosulu');
				if (this.errorState) {
					document.getElementById('icon20').className = 'flaticon-list-2 icon-2x';
					wizardObj.stop();
				} else {
					document.getElementById('icon20').className = 'flaticon-list-2 iconSuccess icon-2x';
				}
			} else if (currentStepId == 30) {
				this.errorState = this.errorControl('vize_durumu');
				if (this.errorState) {
					document.getElementById('icon30').className = 'flaticon2-writing icon-2x';
					wizardObj.stop();
				} else {
					if (this.basvuruForm.get('vize_durumu').value) {

						this.basvuruForm.controls['vize_ulke_kodu'].setValidators([
							Validators.required,
							Validators.pattern(this.validations.kod10)
						]);
						this.basvuruForm.controls['vize_konsolosluk_kodu'].setValidators([
							Validators.required,
							Validators.pattern(this.validations.kod10)
						]);

						this.basvuruForm.get('vize_ulke_kodu').updateValueAndValidity();
						this.basvuruForm.get('vize_konsolosluk_kodu').updateValueAndValidity();
					}

					this.errorState = this.errorControl('*');
					if (this.errorState) {
						document.getElementById('icon30').className = 'flaticon2-writing icon-2x';
						wizardObj.stop();
					} else {
						document.getElementById('icon30').className = 'flaticon2-writing iconSuccess icon-2x';
					}


				}
			} else if (currentStepId == 40) {
				this.errorState = this.errorControl('lise_bilgileri');
				if (this.errorState) {
					document.getElementById('icon40').className = 'flaticon-map-location icon-2x';
					wizardObj.stop();
				} else {

					console.log('Kayıt Güncelleme Durumu', this.guncellemeDurum);

					wizardObj.stop();
					if (this.guncellemeDurum) {

						console.log('Kayıt Güncellemede anlık', this.guncellemeDurum);

						if (!this.changeControl()) {
							wizardObj.goNext();
						} else {
							this.update()
								.then((est) => {

									if ((est.ok) || est) {

										if (this.basvuruForm.get('ogrenci_basvuru_id').value !== null && this.basvuruForm.get('ogrenci_basvuru_id').value !== '') {
											wizardObj.goNext();

											document.getElementById('icon40').className = 'flaticon-map-location iconSuccess icon-2x';
											document.getElementById('2icon40').className = 'flaticon2-checkmark iconSuccess icon-2x';
										}
									}
								});
						}
					} else {

						console.log('Kayıt eklemede', this.guncellemeDurum);

						if (this.basvuruForm.get('ogrenci_basvuru_id').value !== null && this.basvuruForm.get('ogrenci_basvuru_id').value !== '') {
							document.getElementById('icon40').className = 'flaticon-map-location iconSuccess icon-2x';
							document.getElementById('2icon40').className = 'flaticon2-checkmark iconSuccess icon-2x';
							wizardObj.goNext();
						} else {
							this.save()
								.then(
									() => {

										if (this.basvuruForm.get('ogrenci_basvuru_id').value !== null && this.basvuruForm.get('ogrenci_basvuru_id').value !== '') {
											document.getElementById('icon40').className = 'flaticon-map-location iconSuccess icon-2x';
											document.getElementById('2icon40').className = 'flaticon2-checkmark iconSuccess icon-2x';

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
			} else if (currentStepId == 50) {
				this.errorState = this.errorControl('dil_bilgileri');
				if (this.errorState) {
					document.getElementById('icon50').className = 'flaticon2-chat-2 icon-2x';
					wizardObj.stop();
				} else {
					document.getElementById('icon50').className = 'flaticon2-chat-2 iconSuccess icon-2x';
					wizardObj.goNext();
				}
			} else if (currentStepId == 70) {
				this.errorState = this.errorControl('tercih_bilgisi');
				if (this.errorState) {
					document.getElementById('icon70').className = 'flaticon-list icon-2x';
					wizardObj.stop();
				} else {
					if (this.odemeDurumu() == false) {
						this.viewModal();
					}
					wizardObj.goNext();
					document.getElementById('icon70').className = 'flaticon-list iconSuccess icon-2x';
				}
			} else if (currentStepId == 80) {
				if (this.odemeDurumu() == 1) {
					wizardObj.stop();
					this.errorState = this.errorControl('iptal_iade_kosullari');
					this.errorState = this.errorControl('odeme_onay');
					this.odemeKontrol().then(
						() => {
							this.errorState = this.errorControl('iptal_iade_kosullari');
							this.errorState = this.errorControl('odeme_onay');
							if (this.errorState) {
								document.getElementById('icon80').className = 'flaticon-coins icon-2x';
								wizardObj.stop();
							} else {
								document.getElementById('icon80').className = 'flaticon-coins icon-2x iconSuccess';
								wizardObj.goNext();
								this.viewModal();
							}
						},
						() => {
							document.getElementById('icon80').className = 'flaticon-coins icon-2x';
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
									document.getElementById('icon80').className = 'flaticon-coins icon-2x iconSuccess';
									this.viewModal();
									wizardObj.goNext();
								},
								() => {
									document.getElementById('icon80').className = 'flaticon-coins icon-2x';
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
					this.basvuruForm.controls['kabul_kosulu'].setValidators([
						Validators.required
					]);
					this.basvuruForm.get('kabul_kosulu').updateValueAndValidity();
				}
				if (nextStepID === 30) {
					this.basvuruForm.controls['vize_durumu'].setValidators([
						Validators.required,
						Validators.pattern(this.validations.sayisalKod1)
					]);
					this.basvuruForm.get('vize_durumu').updateValueAndValidity();
				}
				if (nextStepID === 40) {
					this.basvuruForm.controls['lise_bilgileri'].setValidators([
						Validators.requiredTrue
					]);
					this.basvuruForm.get('lise_bilgileri').updateValueAndValidity();
				}
				if (nextStepID === 50) {
					this.basvuruForm.controls['dil_bilgileri'].setValidators([
						Validators.requiredTrue
					]);
					this.basvuruForm.get('dil_bilgileri').updateValueAndValidity();
					console.log('nextStepID', nextStepID);

				}
				if (nextStepID === 70) {
					this.basvuruForm.controls['tercih_bilgisi'].setValidators([
						Validators.requiredTrue
					]);
					this.basvuruForm.get('tercih_bilgisi').updateValueAndValidity();
					console.log('nextStepID', nextStepID);
				}
				if (nextStepID === 80) {
					if (this.odemeDurumu() == 1) {
						this.basvuruForm.controls['iptal_iade_kosullari'].setValidators([
							Validators.requiredTrue
						]);
						this.basvuruForm.get('iptal_iade_kosullari').updateValueAndValidity();
						this.basvuruForm.controls['odeme_onay'].setValidators([
							Validators.required,
							Validators.pattern('[1]{1}')
						]);

						this.basvuruForm.get('odeme_onay').updateValueAndValidity();
					} else {
						this.basvuruForm.controls['dekont'].setValidators([
							Validators.required
						]);
						this.basvuruForm.get('dekont').updateValueAndValidity();
					}
				}

				console.log('Gidiş currentStepId', currentStepId);
				console.log('Gidiş form', this.basvuruForm);
			}
		});
		wizard.on('beforePrev', (wizardObj) => {
			currentStep = Number(wizardObj.currentStep) - 1;
			currentStepId = Number(wizard.steps[currentStep].id);
			this.stepsIDList.forEach(element => {
				console.log('Geri step', currentStepId);
				if (currentStepId === Number(element)) {
					if (Number(element) === 20) {
						this.basvuruForm.controls['kabul_kosulu'].clearValidators();
						this.basvuruForm.get('kabul_kosulu').updateValueAndValidity();
						this.errorState = false;
						return false;
					}
					if (Number(element) === 30) {
						this.basvuruForm.controls['vize_durumu'].clearValidators();
						this.basvuruForm.controls['vize_ulke_kodu'].clearValidators();
						this.basvuruForm.controls['vize_konsolosluk_kodu'].clearValidators();
						this.basvuruForm.get('vize_durumu').updateValueAndValidity();
						this.basvuruForm.get('vize_ulke_kodu').updateValueAndValidity();
						this.basvuruForm.get('vize_konsolosluk_kodu').updateValueAndValidity();
						this.errorState = false;
						//wizardObj.goTo(2);
						return false;
					}
					if (Number(element) === 40) {
						this.basvuruForm.controls['lise_bilgileri'].clearValidators();
						this.basvuruForm.get('lise_bilgileri').updateValueAndValidity();
						this.errorState = false;
						return false;
					}
					if (Number(element) === 50) {
						this.basvuruForm.controls['dil_bilgileri'].clearValidators();
						this.basvuruForm.get('dil_bilgileri').updateValueAndValidity();
						this.errorState = false;

						console.log('Number(element)', Number(element));
						return false;
					}
					if (Number(element) === 70) {
						this.basvuruForm.controls['tercih_bilgisi'].clearValidators();
						this.basvuruForm.get('tercih_bilgisi').updateValueAndValidity();
						this.errorState = false;
						console.log('Number(element)', Number(element));
						return false;
					}
					if (Number(element) === 80) {
						if (this.odemeDurumu() == 1) {
							this.basvuruForm.controls['odeme_onay'].clearValidators();
							this.basvuruForm.get('odeme_onay').updateValueAndValidity();
							this.basvuruForm.controls['iptal_iade_kosullari'].clearValidators();
							this.basvuruForm.get('iptal_iade_kosullari').updateValueAndValidity();
						} else {
							this.basvuruForm.controls['dekont'].clearValidators();
							this.basvuruForm.get('dekont').updateValueAndValidity();
						}
						this.errorState = false;
						return false;
					}
				}
			});

			console.log('Geri form', this.basvuruForm);
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
			this.basvuruVerileri = this.data.basvuruBilgileri.data;

			if (this.data.basvuruBilgileri.data.kayit_turu_durumu) {
				if (this.data.kabulKosullari.result) {
					this.kabulKosulVerileri = this.data.kabulKosullari.data;
					this.bilgiDurum = false;
				} else {
					this.bilgiDurum = true;
					this.bilgiMesaj = this.translate.instant("TEXT.KABUL_KOSUL_EKSIK");
				}
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
				basvuruId: this.basvuruVerileri.basvuru_id,
				dil: this.localStorageService.getItem("language")
			}
			var deger = "https://dokoapi.dpu.edu.tr/student/payment/application/" + dataOdeme.token + "/" + dataOdeme.birimUid + "/" + dataOdeme.basvuruId + "/" + dataOdeme.dil;

			this.posOdemeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(deger);
		}
	}
	formInit() {
		this.basvuruForm.get('basvuru_id').setValue(this.basvuruVerileri.basvuru_id);
		this.basvuruForm.get("raporlar").setValue(this.basvuruVerileri.raporlar);

		if (this.basvuruVerileri.ogrenci_basvuru_id) {
			this.guncellemeDurum = true;
			//this.ifIframePos = true;
			this.basvuruForm.get("ogrenci_basvuru_id").setValue(this.basvuruVerileri.ogrenci_basvuru_id);
			this.basvuruForm.get("kullanim_kosullari").setValue(true);
			this.basvuruForm.get("kabul_kosulu").setValue(this.basvuruVerileri.kabul_kosulu);
			this.basvuruForm.get("vize_durumu").setValue(this.basvuruVerileri.ogrenci_basvuru_vize_durumu);
			this.basvuruForm.get("vize_ulke_kodu").setValue(this.basvuruVerileri.ogrenci_basvuru_vize_ulke_kodu);
			this.basvuruForm.get("vize_konsolosluk_kodu").setValue(this.basvuruVerileri.ogrenci_basvuru_vize_konsolosluk_kodu);
			this.basvuruForm.get("odeme_onay").setValue(this.basvuruVerileri.odeme_onay);
			this.basvuruForm.get("dekont").setValue(this.basvuruVerileri.ogrenci_basvuru_dekont);
		} else {
			this.guncellemeDurum = false;
			//this.ifIframePos = false;
		}

	}
	inputChange($event, $type) {
		if ($event.target.checked) {
			let text = this.basvuruVerileri[$type];
			this.openModal(text, $type);
		}
	}
	errorControl(input: string): any {
		let result = this.errorService.errorControl(input, this.basvuruForm);
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
			Object.keys(this.basvuruForm.controls).forEach(key => {
				if (!change) {
					if (!this.basvuruForm.get(key).pristine) {
						change = true;
						return false;
					}
				}
			});
		} else {
			change = (!this.basvuruForm.get(paramt).pristine) ? true : false;
		}

		return change;
	}
	openModal(text: any, titleType: string) {
		var title = this.translate.instant("TEXT." + titleType);
		var data = { text: text, title: title }
		const dialogRef = this.dialog.open(TextDisplayComponent, { data, width: "40%", minWidth: "310px", height: "75%", maxHeight: "500px" });
		dialogRef.afterClosed().subscribe(rest => {
			this.basvuruForm.get("kullanim_kosullari").setValue(true);
		});
	}
	iptalIadeUrl() {
		window.open(this.apiSetting['iptal_iade_kosullari_url'], "_blank");
		this.basvuruForm.get("iptal_iade_kosullari").setValue(true);
		this.ifIframePos = true;
	}
	alanKontrol(tip: string, durum): any {
		if (tip == 'lise') {
			this.basvuruForm.get('lise_bilgileri').setValue(durum);
			console.log('kontrol', this.basvuruForm.value);
		} else if (tip == 'dil') {
			this.basvuruForm.get('dil_bilgileri').setValue(durum);
			console.log('kontrol', this.basvuruForm.value);
		} else if (tip == 'vize') {
			if (durum.vizeVerileri.vize_durum == 1) {
				this.basvuruForm.get('vize_durumu').setValue(durum.vizeVerileri.vize_durum);
				this.basvuruForm.get('vize_ulke_kodu').setValue(durum.vizeVerileri.vize_ulke_kodu);
				this.basvuruForm.get('vize_konsolosluk_kodu').setValue(durum.vizeVerileri.vize_konsolosluk_kodu);
			} else {

			}
			console.log('kontrol', this.basvuruForm.value);
		} else if (tip == 'tercih') {
			this.basvuruForm.get('tercih_bilgisi').setValue(durum);
			console.log('kontrol', this.basvuruForm.value);
		}
	}
	odemeKontrol(): any {
		console.log('odemeKontrol');
		let promise = new Promise((resolve, reject) => {
			this.studentService
				.getSinavBasvuruDetay(this.basvuruForm.get('basvuru_id').value, 2)
				.subscribe(res => {
					console.log('odemeKontrol', res);
					if (res.result) {
						if ((res.data.basvuruBilgileri.data.odeme_onay) && (res.data.basvuruBilgileri.data.odeme_tarihi) !== null) {
							this.basvuruForm.get('odeme_onay').setValue(1);
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

			console.log("Kaydetme errorState", this.errorState);

			if (this.errorState == false) {
				this.studentService
					.lisansBasvuruKaydet(this.basvuruForm.value)
					.subscribe(res => {
						console.log("Kaydetme veri kayıt dönüşü", res);
						if (res.result) {
							Swal.fire({
								text: this.translate.instant('TEXT.SAVE_SUCCESSFUL'),
								icon: 'success',
								showConfirmButton: false,
								timer: 2500
							});
							this.basvuruForm.get('ogrenci_basvuru_id').setValue(res.data.ogrenci_basvuru_id);
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
					.lisansBasvuruKaydet(this.basvuruForm.value)
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
				.uploadExamDekont(this.basvuruForm.value)
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
		this.basvuruForm.controls['onay'].setValidators([
			Validators.requiredTrue
		]);
		this.basvuruForm.get('onay').updateValueAndValidity();
		this.errorControl("*");
		if (this.errorState == false) {
			this.studentService
				.approve_application(this.basvuruForm.get('ogrenci_basvuru_id').value, this.basvuruForm.get('basvuru_id').value)
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
							text: this.translate.instant(res.error.code),
							icon: 'error'
						});
					}
				});
		}
	}
	odemeDurumu(): any {
		if (this.basvuruVerileri.ucret_odeme_turu == this.ucretOdemeTuru.odeme_istenmiyor) {
			return false;
		} else {
			if (this.basvuruVerileri.ucret_zamani == this.ucretOdemeZamani.sinavdan_sonra) {
				return false;
			} else {
				if (this.basvuruVerileri.ucret_zamani == this.ucretOdemeZamani.sinavdan_once && this.basvuruVerileri.ucret_odeme_turu == this.ucretOdemeTuru.online) {
					return 1;
				}
				if (this.basvuruVerileri.ucret_zamani == this.ucretOdemeZamani.sinavdan_once && this.basvuruVerileri.ucret_odeme_turu == this.ucretOdemeTuru.dekont) {
					return 2;
				}
			}
		}
	}
	viewModal() {
		console.log('*0*', this.basvuruForm.value);
		const dialogRef = this.dialog.open(BasvuruGoruntulemeComponent, {
			data: this.basvuruForm.value,
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
