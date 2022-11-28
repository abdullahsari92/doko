import { ChangeDetectorRef, Component, HostListener, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { TranslateService } from '../../../core/services/translate.service';
import { StudentService } from '../../services/student.service';
import { AktifBasvuruModel } from '../../models/aktif-basvuru.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BasvuruTurEnum } from '../../../core/Enums/BasvuruTurEnum';
import { OgrenciBasvuruDurumEnum } from '../../../core/Enums/OgrenciBasvuruDurum.enum';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { SanalOdemeService } from '../../services/sanal-odeme.service';
import { sanalPosModel } from '../../models/sanalPos.model';
import { getuid } from 'process';
import { Guid } from '../../services/guid';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DokoSettingsService } from '../../../core/services/doko-settings.service';
import { HazirlikBasvuruComponent } from '../ogrenci-basvuru/hazirlik-basvuru/hazirlik-basvuru.component';
import { SinavBasvuruComponent } from '../ogrenci-basvuru/sinav-basvuru/sinav-basvuru.component';
import { LisansBasvuruComponent } from '../ogrenci-basvuru/lisans-basvuru/lisans-basvuru.component';
import { ErrorService } from '../../services/error.service';
import { apiSetting } from '../../../../../src/app/core/models/apiSetting';
import { BasvuruGoruntulemeComponent } from '../ogrenci-basvuru/basvuru-goruntuleme/basvuru-goruntuleme.component';
import { IdentityStudentService } from '../../../student/services/identity-student.service';
import { UcretOdemeTuru, UcretOdemeZamani } from '../../../core/Enums/ucret-odeme.enum';
import { SharedService } from '../../services/shared.service';
import { debounce, finalize, takeUntil, map, tap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { stringToArray } from 'ag-grid-community';

@Component({
	selector: 'kt-dashboard',
	templateUrl: './home-page.component.html',
	styleUrls: [
		'./home-page.component.scss',
	]
})
export class HomePageComponent implements OnInit {
	//Tanımlar Başlangıç
	public dekontDurumu: boolean = false;
	//Tanımlar Bitiş

	//Diziler Başlangıç
	public aktifIslemler: any[] = [];// İşlem altında sınav bulunuyorsa gösterilmesi için kullanılıyor.
	public kabulKosullari: any[] = [];
	public aktifBasvuruModel: any = [];
	public tamamlanmayanBasvuruModel: any = [];
	public gecmisBasvuruModel: any = [];
	//Diziler Bitiş

	//Bağlı Durumlar Başlangıç
	public dialogRef: any;
	public posOdemeUrl: any;
	public basvuruTuru = null;
	public ogrenciBilgiDurumu = null;
	public errorState: boolean = false;
	public ifIframePos: boolean = false;
	public ucretOdemeYontemi: number = 0;
	public girisUcretOdemeYontemi: number = 0;
	public aktifSinavMerkezleri: boolean = true;
	public seciliSekme: number = 0;// 0: Bilgi Bulunamadı | 1: Veri Bulundu | 2: Başvuru Türü Seçildi
	public seciliSinavDonemi: number = 0;// 0: Geçmiş | 1: Aktif  | 2: Tamamlanmayan
	public aktifBasvuruDurumu: boolean = false;
	public tamamlanmayanBasvuruDurumu: boolean = false;
	public gecmisBasvuruDurumu: boolean = false;
	public activeLang = this.localStorageService.getActiveLang();
	private clickEventsubscription: Subscription;
	private unsubscribe: Subject<any>;
	//Bağlı Durumlar Bitiş

	//Enum Durumlar Başlangıç
	public ucretOdemeTuru = UcretOdemeTuru;
	public ucretOdemeZamani = UcretOdemeZamani;
	public basvuruTurEnum = BasvuruTurEnum;
	public OgrenciBasvuruDurumEnum = OgrenciBasvuruDurumEnum;
	apiSetting: apiSetting = new apiSetting();
	//Enum Durumlar Bitiş

	//Formlar Başlangıç
	odemeForm = new FormGroup({
		basvuru_id: new FormControl(''),
		ogrenci_basvuru_id: new FormControl(''),
		odeme_onay: new FormControl(''),
		iptal_iade_kosullari: new FormControl(''),
		dekont: new FormControl('', [
			Validators.required
		])
	});
	//Formlar Bitiş
	//ViewChild Bitiş
	@ViewChild('odemeModal', { static: true }) odemeModal: TemplateRef<any>;
	//ViewChild Bitiş

	constructor(
		private translate: TranslateService,
		private sharedService: SharedService,
		private studentService: StudentService,
		private cdr: ChangeDetectorRef,
		private dialog: MatDialog,
		private router: Router,
		private localStorageService: LocalStorageService,
		@Inject(DOCUMENT)
		private readonly documentRef: Document,
		private errorService: ErrorService,
		private identityStudentService: IdentityStudentService,
		private sanitizer: DomSanitizer,
		private sanalOdemeService: SanalOdemeService,
		private dokoSettingsService: DokoSettingsService
	) {
		this.clickEventsubscription = this.sharedService.selectedProduct.subscribe((value) => {
			if (value == 99) {
				this.seciliSekme = 1;
			}
		});
		this.unsubscribe = new Subject();
	}
	ngOnInit(): void {
		this.apiSetting = this.localStorageService.getItem("apiSetting") as apiSetting;
		this.getSwal();

		this.personalInfo()
			.then(() => {
				if (this.ogrenciBilgiDurumu == false) {
					Swal.fire({
						text: this.translate.instant("TEXT.OPERATION_FAILED"),
						html: this.translate.instant("TEXT.REQUIREDDATA"),
						icon: 'error',
						showConfirmButton: true,
						allowOutsideClick: false
					}).then((result) => {
						if (result.isConfirmed) {
							this.router.navigateByUrl('/personalinfo/1');
						}
					});
				} else {
					Swal.close();
					this.odemeIslemi(1);
					this.getBirimIslemListesi();
				}
			});
	}
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
	basvuruDurumu(basvuruDurumu: number, basvuruYapmis: number, alan: string) {
		let text = '';
		console.log('basvuruDurumu', basvuruDurumu);
		console.log("--", basvuruYapmis);

		if (basvuruDurumu==null && basvuruYapmis == 0) {
			text = this.translate.instant("TEXT.APP_YET_APPLIED");
		} else if (basvuruDurumu == OgrenciBasvuruDurumEnum.yeni_kayit) {
			if (alan == 'barSize') {
				text = '33%';
			} else if (alan == 'barColor') {
				text = 'danger';
			} else if (alan == 'barText') {
				text = this.translate.instant("TEXT.APP_NOT_APPROVED");
			}
		} else if (basvuruDurumu == OgrenciBasvuruDurumEnum.ogrenci_onayladi) {
			if (alan == 'barSize') {
				text = '66%';
			} else if (alan == 'barColor') {
				text = 'warning';
			} else if (alan == 'barText') {
				text = this.translate.instant("TEXT.WAIT_ADMIN_APPROVED");
			}
		} else if (basvuruDurumu == OgrenciBasvuruDurumEnum.yonetici_onayladi) {
			if (alan == 'barText') {
				text = this.translate.instant("TEXT.APP_APPROVED");
			}
		} else {
			return alan == 'barSize' ? '0%' : true;
		}
		console.log("--", text);
		return text;
	}
	getBirimIslemListesi() {
		this.studentService
			.getBirimIslemListesi()
			.pipe(
				tap(rest => {
					console.log('getBirimIslemListesi', rest);
					if (rest.result) {
						this.seciliSekme = 1;
						Object.keys(rest.data).forEach((value) => {
							if (rest.data[value]) {
								this.aktifIslemler.push(value);
								if (value == this.basvuruTurEnum.girisUcreti) {
									this.odemeIslemi(2);
								}
							}
						});
						if (this.aktifIslemler.length == 1 && this.aktifIslemler[(Object.keys(this.aktifIslemler))[0]] !== 5) {
							this.seciliSekme = 2;
							this.basvuruTuruSec(this.aktifIslemler[(Object.keys(this.aktifIslemler))[0]]);
						}
					} else {
						this.seciliSekme = 0;
					}
				}),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	aktifIslemlerListesi() {
		let dizi = [];
		this.aktifIslemler.forEach((value) => {
			if (value !== this.basvuruTurEnum.girisUcreti) {
				dizi.push(value);
			}
		});
		return dizi;
	}
	nationality_info_get() {
		let promise = new Promise((resolve, reject) => {
			this.studentService
				.nationality_info_get()
				.subscribe(res => {
					if (res.result) {
						this.ogrenciBilgiDurumu = true;
						Object.keys(res.data).forEach((key) => {
							if (key !== 'pasaport2_dosya' && key !== 'pasaport2_no' && key !== 'uyruk2_kodu' && key !== 'uyruk2_sebebi_id' && key !== 'mavi_kart_belge' && key !== 'mavi_kart_durumu') {
								if (res.data[key] == null || res.data[key] == '') {
									this.ogrenciBilgiDurumu = false;
									return false;
								}
							}
						});
					} else {
						this.ogrenciBilgiDurumu = false;
					}
					setTimeout(() => {
						resolve(true);
					}, 1000);
				}, err => {
					reject(false);
				});
		});
		return promise;
	}
	language_info_get(basvuruId: number) {
		let promise = new Promise((resolve, reject) => {
			this.studentService
				.language_get_list(basvuruId)
				.subscribe(res => {
					console.log('language_info_get', res);
					if (res.result) {
						this.ogrenciBilgiDurumu = true;
					} else {
						this.ogrenciBilgiDurumu = false;
					}
					setTimeout(() => {
						resolve(true);
					}, 1000);
				}, err => {
					reject(false);
				});
		});
		return promise;
	}
	personalInfo() {
		let promise = new Promise((resolve, reject) => {
			this.studentService
				.personalInfo()
				.subscribe(res => {
					if (res.result) {
						Object.keys(res.data).forEach((key) => {
							if (key !== 'kimlik_no') {
								if (res.data[key] == null || res.data[key] == '') {
									this.ogrenciBilgiDurumu = false;
									return false;
								}
							}
						});
						setTimeout(() => {
							resolve(true);
						}, 1000)
					}
				}, err => {
					reject(false);
				});
		});
		return promise;
	}
	basvuruTuruSec(basvuruTuru) {
		this.basvuruTuru = basvuruTuru;
		this.kullaniciSecim = false;
		let kontrol = this.aktifIslemler.filter(b => b == this.basvuruTurEnum.girisUcreti);
		if (kontrol.length == 1) {
			this.odemeIslemi(2);
		} else {
			this.seciliSekme = 2;
			this.sharedService.sendClickEvent(this.basvuruTuru);
			this.getAktifBasvuru(basvuruTuru);
			this.getTamamlanmayanBasvuru(basvuruTuru);
			this.getGecmisBasvurular(basvuruTuru);
		}
	}
	getAktifBasvuru(basvuruTuru) {
		this.aktifBasvuruModel = [];
		this.studentService
			.getAktifBasvurular(basvuruTuru)
			.pipe(
				tap(rest => {
					console.log('getAktifBasvurular', rest);
					if (rest.result) {
						this.aktifBasvuruModel = rest.data;
						this.aktifBasvuruDurumu = true;
					} else {
						this.aktifBasvuruDurumu = false;
					}
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	getTamamlanmayanBasvuru(basvuruTuru) {
		this.tamamlanmayanBasvuruModel = [];
		this.studentService
			.getTamamlanmayanBasvurular(basvuruTuru)
			.pipe(
				tap(rest => {
					console.log('getTamamlanmayanBasvurular', rest);
					if (rest.result) {
						this.tamamlanmayanBasvuruModel = rest.data;
						this.tamamlanmayanBasvuruDurumu = true;

						Object.keys(this.tamamlanmayanBasvuruModel).forEach((value) => {
							let veri = this.tamamlanmayanBasvuruModel[value];
							if (veri.ogrenci_basvuru_durumu == OgrenciBasvuruDurumEnum.yeni_kayit) {
								Swal.fire({
									title: this.translate.instant("TEXT.INFORM"),
									text: this.translate.instant("TEXT.YOU_NOT_APPROVED"),
									icon: 'info',
									showConfirmButton: true,
									allowOutsideClick: false,
									confirmButtonColor: '#3085d6'
								}).then((result) => {
									if (result.isConfirmed) {
										Swal.close();
									}
								});
							}

						});
					} else {
						this.tamamlanmayanBasvuruDurumu = false;
					}
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	getGecmisBasvurular(basvuruTuru) {
		this.gecmisBasvuruModel = [];
		this.studentService
			.getGecmisBasvurular(basvuruTuru)
			.pipe(
				tap(rest => {
					console.log('getGecmisBasvurular', rest);
					if (rest.result) {
						this.gecmisBasvuruModel = rest.data;
						this.gecmisBasvuruDurumu = true;
					} else {
						this.gecmisBasvuruDurumu = false;
					}
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	odemeIslemi(tip: number) {//1: yerleştirme sonrası ödeme | 2:giriş ücreti
		if (tip == 1) {
			this.studentService
				.getYerlestirmeSonrasiOdeme()
				.pipe(
					tap(rest => {
						if (rest.result && rest.data.ucret_odeme_turu != this.ucretOdemeTuru.odeme_istenmiyor) {

							Object.keys(this.odemeForm.controls).forEach((key) => {
								this.odemeForm.get(key).setValue(rest.data[key]);
							});

							if (rest.data.ucret_odeme_turu == this.ucretOdemeTuru.online) {
								this.ucretOdemeYontemi = this.ucretOdemeTuru.online;
							} else if (rest.data.ucret_odeme_turu == this.ucretOdemeTuru.dekont) {
								this.ucretOdemeYontemi = this.ucretOdemeTuru.dekont;
							}

							Swal.fire({
								title: this.translate.instant("TEXT.CONGRATULATIONS"),
								text: this.translate.instant("TEXT.SUCCESS_PLACEMENT"),
								icon: 'success',
								showConfirmButton: true,
								allowOutsideClick: false,
								confirmButtonColor: '#3085d6',
								confirmButtonText: this.translate.instant("TEXT.ODEME"),
								showCancelButton: true,
								cancelButtonColor: '#d33',
								cancelButtonText: this.translate.instant("TEXT.CANCEL")
							}).then((result) => {
								if (result.isConfirmed) {
									this.odemeBilgiEkle(rest.data.basvuru_id);
									this.odemeDialog();
								}
							});
						} else {
							this.ucretOdemeYontemi = 0;
						}
					}),
					takeUntil(this.unsubscribe),
					finalize(() => {
						this.cdr.markForCheck();
					})
				)
				.subscribe();
		} else {
			this.studentService
				.getGirisUcretiOdeme()
				.pipe(
					tap(rest => {
						if (rest.result && Number(rest.data.ucret_odeme_turu) != this.ucretOdemeTuru.odeme_istenmiyor) {

							this.seciliSekme = 1;
							Object.keys(this.odemeForm.controls).forEach((key) => {
								this.odemeForm.get(key).setValue(rest.data[key]);
							});

							if (rest.data.ucret_odeme_turu == this.ucretOdemeTuru.online) {
								this.girisUcretOdemeYontemi = this.ucretOdemeTuru.online;
							} else if (rest.data.ucret_odeme_turu == this.ucretOdemeTuru.dekont) {
								this.girisUcretOdemeYontemi = this.ucretOdemeTuru.dekont;
								if (rest.data.dekont !== null && (rest.data.dekont).indexOf("/uploads/") != -1) {
									this.dekontDurumu = true;
								} else {
									this.dekontDurumu = false;
								}
							}

							if (rest.data.ucret_odeme_turu == this.ucretOdemeTuru.dekont && rest.data.odeme_onay == 0 && (rest.data.dekont !== null && (rest.data.dekont).indexOf("/uploads/") != -1)) {
								Swal.fire({
									title: this.translate.instant("TEXT.INFORM"),
									text: this.translate.instant("TEXT.EF_WAITING_APPROVAL_ADMIN"),
									icon: 'info',
									showConfirmButton: true,
									allowOutsideClick: false,
									confirmButtonColor: '#3085d6',
									confirmButtonText: "OK",
									showCancelButton: true,
									cancelButtonColor: '#d33',
									cancelButtonText: this.translate.instant("TEXT.CANCEL")
								});
							} else {
								Swal.fire({
									title: this.translate.instant("TEXT.INFORM"),
									text: this.translate.instant("TEXT.ENTRANCE_FEE"),
									icon: 'info',
									showConfirmButton: true,
									allowOutsideClick: false,
									confirmButtonColor: '#3085d6',
									confirmButtonText: this.translate.instant("TEXT.ODEME"),
									showCancelButton: true,
									cancelButtonColor: '#d33',
									cancelButtonText: this.translate.instant("TEXT.CANCEL")
								}).then((result) => {
									if (result.isConfirmed) {
										this.odemeBilgiEkle(rest.data.basvuru_id);
										this.odemeDialog();
									}
								});
							}
						} else {
							this.girisUcretOdemeYontemi = 0;
							if (this.basvuruTuru) {
								this.seciliSekme = 2;
								this.sharedService.sendClickEvent(this.basvuruTuru);
								this.getAktifBasvuru(this.basvuruTuru);
								this.getTamamlanmayanBasvuru(this.basvuruTuru);
								this.getGecmisBasvurular(this.basvuruTuru);
							}
						}
					}),
					takeUntil(this.unsubscribe),
					finalize(() => {
						this.cdr.markForCheck();
					})
				)
				.subscribe();
		}

		/* 
				if (getData.basvuruBilgileri.data.ogrenci_basvuru_durumu == 3) {
					if (this.basvuruTuru == this.basvuruTurEnum.lisans) {
						if (getData.basvuruBilgileri.data.ucret_odeme_turu != this.ucretOdemeTuru.odeme_istenmiyor) {
							if (getData.basvuruBilgileri.data.ucret_odeme_turu == this.ucretOdemeTuru.online && getData.basvuruBilgileri.data.ucret_odeme_turu == this.ucretOdemeZamani.sinavdan_sonra && getData.basvuruBilgileri.data.yerlesme_durumu == 1) {
								Swal.fire({
									text: this.translate.instant("TTEXT.SUCCESS_PLACEMENT"),
									html: this.translate.instant("TEXT.REQUIREDDATA"),
									icon: 'success',
									showConfirmButton: true,
									allowOutsideClick: false
								}).then((result) => {
									
								});
							}
						}
					}
				} else {
					this.zorunluAlanlar(res.data).then(() => {
						if (this.ogrenciBilgiDurumu) {
							if (islemTipi == OgrenciBasvuruDurumEnum.yeni_kayit) {
								this.editModal(res.data)
							} else if (islemTipi == OgrenciBasvuruDurumEnum.ogrenci_onayladi) {
								this.viewModal(res.data)
							}
						}
					});
				} */
	}
	iptalIadeUrl() {
		window.open(this.apiSetting['iptal_iade_kosullari_url'], "_blank");
		this.odemeForm.get('iptal_iade_kosullari').setValue(true);
		this.ifIframePos = true;
	}
	odemeBilgiEkle(basvuru_id: number) {
		var dataOdeme = {
			token: this.identityStudentService.get(),
			birimUid: this.localStorageService.getItem("apiSetting").birim_uid,
			basvuruId: basvuru_id,
			dil: this.localStorageService.getItem("language")
		}
		var deger = "https://dokoapi.dpu.edu.tr/student/payment/application/" + dataOdeme.token + "/" + dataOdeme.birimUid + "/" + dataOdeme.basvuruId + "/" + dataOdeme.dil;
		this.posOdemeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(deger);
	}
	odemeDialog() {
		this.dialogRef = this.dialog.open(this.odemeModal,
			{
				width: "35%",
				minWidth: "310px",
				maxHeight: (this.ucretOdemeYontemi == 1 || this.girisUcretOdemeYontemi == 1) ? "700px" : "80vh",
				autoFocus: false
			});
		this.dialogRef.afterClosed().subscribe(result => {
			this.odemeForm.get('iptal_iade_kosullari').setValue(null);
			this.ifIframePos = false;
		});
	}
	dekontYukle() {
		this.errorControl("*");
		if (this.errorState == false) {
			this.studentService
				.uploadExamDekont(this.odemeForm.value)
				.subscribe(res => {
					console.log('uploadExamDekont', res);
					if (res.result) {
						Swal.fire({
							title: this.translate.instant('TEXT.INFORM'),
							text: this.translate.instant("TEXT.PAYMENT_CONFIRMATION"),
							icon: 'success',
							showConfirmButton: true
						}).then((result) => {
							if (result.isConfirmed) {
								this.dialogRef.close();
							}
						});
					} else {
						Swal.fire({
							title: this.translate.instant("TEXT.OPERATION_FAILED"),
							text: this.translate.instant(res.error.message),
							icon: 'error',
							showConfirmButton: true
						}).then((result) => {
							if (result.isConfirmed) {
								this.dialogRef.close();
							}
						});
					}
				});
		}


	}
	errorControl(input: string): any {
		let result = this.errorService.errorControl(input, this.odemeForm);
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
	kullaniciSecim: boolean = false;
	sinavDonemi(donem?) {
		if (donem !== undefined) {
			this.seciliSinavDonemi = donem;
			this.kullaniciSecim = true;
		} else {
			if (!this.kullaniciSecim) {
				if (this.aktifBasvuruDurumu || (this.aktifBasvuruModel).length > 0) {
					this.seciliSinavDonemi = 1;
				} else {
					if (this.tamamlanmayanBasvuruDurumu || (this.tamamlanmayanBasvuruModel).length > 0) {
						this.seciliSinavDonemi = 2;
					} else {
						if (this.gecmisBasvuruDurumu || (this.gecmisBasvuruModel).length > 0) {
							this.seciliSinavDonemi = 0;
						} else {
							this.seciliSekme = 0;
						}
					}
				}
			}
		}

		console.log('--', this.seciliSinavDonemi);

		return this.seciliSinavDonemi;

	}
	sinavDonemVerileri() {
		if (this.seciliSinavDonemi == 1) {
			return this.aktifBasvuruModel;
		} else if (this.seciliSinavDonemi == 2) {
			return this.tamamlanmayanBasvuruModel;
		} else if (this.seciliSinavDonemi == 0) {
			return this.gecmisBasvuruModel;
		} else {
			this.sinavDonemi();
		}
	}
	getBasvuruDetay(item: any) {
		this.studentService
			.getSinavBasvuruDetay(item.id, this.basvuruTuru)
			.subscribe(res => {
				console.log('getBasvuruDetay', res);
				if (res.result) {
					this.zorunluAlanlar(res.data).then(() => {
						if (this.ogrenciBilgiDurumu) {
							if (item.ogrenci_basvuru_durumu == OgrenciBasvuruDurumEnum.yeni_kayit || item.ogrenci_basvuru_durumu == null) {
								this.editModal(res.data);
							} else if (item.ogrenci_basvuru_durumu == OgrenciBasvuruDurumEnum.ogrenci_onayladi || item.ogrenci_basvuru_durumu == OgrenciBasvuruDurumEnum.yonetici_onayladi) {
								this.viewModal(res.data);
							}
						}
					});

					/* if (res.data.basvuruBilgileri.data.uyruk_bilgisi_durumu && res.data.basvuruBilgileri.data.basvuru_yapmis == 0) {
						this.getSwal();
						this.nationality_info_get()
							.then(() => {
								if (this.ogrenciBilgiDurumu == false) {
									Swal.fire({
										text: this.translate.instant("TEXT.OPERATION_FAILED"),
										html: this.translate.instant("TEXT.REQUIREDDATA"),
										icon: 'error',
										showConfirmButton: true,
										allowOutsideClick: false
									}).then((result) => {
										if (result.isConfirmed) {
											this.router.navigateByUrl('/personalinfo/2');
										}
									});
								} else {
									Swal.close();
									if (islemTipi == OgrenciBasvuruDurumEnum.yeniKayit) {
										this.editModal(res.data)
									} else if (islemTipi == OgrenciBasvuruDurumEnum.ogrenciOnayladi) {
										this.viewModal(res.data)
									}
								}
							});
					} else {
						if (islemTipi == OgrenciBasvuruDurumEnum.yeniKayit) {
							this.editModal(res.data)
						} else if (islemTipi == OgrenciBasvuruDurumEnum.ogrenciOnayladi) {
							this.viewModal(res.data)
						}
					} */


					/* if (islemTipi == OgrenciBasvuruDurumEnum.yeniKayit) {
						this.editModal(res.data)
					} else if (islemTipi == OgrenciBasvuruDurumEnum.ogrenciOnayladi) {
						this.viewModal(res.data)
					} */

				} else {
					Swal.fire({
						title: this.translate.instant("TEXT.OPERATION_FAILED"),
						html: this.translate.instant(res.error.code),
						icon: 'error',
						showConfirmButton: true,
						allowOutsideClick: false
					}).then((result) => {
						if (result.isConfirmed) {
							Swal.close();
						}
					});
				}
			});
	}
	editModal(data) {
		if (this.basvuruTuru == this.basvuruTurEnum.sinav) {
			const dialogRef = this.dialog.open(SinavBasvuruComponent,
				{ data, width: "65%", minWidth: "350px", height: "85%", maxHeight: "700px" });
			dialogRef.afterClosed().subscribe(refData => {
				this.basvuruTuruSec(this.basvuruTuru);
			});
		} else if (this.basvuruTuru == this.basvuruTurEnum.lisans) {
			const dialogRef = this.dialog.open(LisansBasvuruComponent,
				{ data, width: "65%", minWidth: "350px", height: "85%", maxHeight: "700px" });
			dialogRef.afterClosed().subscribe(refData => {
				this.basvuruTuruSec(this.basvuruTuru);
			});
		}
	}
	zorunluAlanlar(data): any {
		let url = '';
		if (this.basvuruTuru == this.basvuruTurEnum.sinav) {
			if (data.basvuruBilgileri.data.uyruk_bilgisi_durumu) {
				this.getSwal();
				return this.nationality_info_get()
					.then(() => {
						if (this.ogrenciBilgiDurumu) {
							Swal.close();
						} else {
							this.getSwal('/personalinfo/2');
						}
						return this.ogrenciBilgiDurumu;
					});
			}
		} else if (this.basvuruTuru == this.basvuruTurEnum.lisans) {
			if (data.basvuruBilgileri.data.dil_bilgisi_durumu) {
				this.getSwal();
				return this.language_info_get(data.basvuruBilgileri.data.basvuru_id)
					.then(() => {
						if (this.ogrenciBilgiDurumu) {
							Swal.close();
						} else {
							this.getSwal('/educationinfo/4/' + data.basvuruBilgileri.data.basvuru_id);
						}
						return this.ogrenciBilgiDurumu;
					});
			} else if (data.basvuruBilgileri.data.uyruk_bilgisi_durumu) {
				console.log('uyruk zorunluluğu var');
				this.getSwal();
				return this.nationality_info_get()
					.then(() => {
						if (this.ogrenciBilgiDurumu) {
							Swal.close();
						} else {
							this.getSwal('/personalinfo/2');
						}
						return this.ogrenciBilgiDurumu;
					});
			}
			console.log(' zorunluluğu bulunamadı');
		}

		let promise = new Promise((resolve, reject) => {
			this.ogrenciBilgiDurumu = true;
			console.log('this.ogrenciBilgiDurumu', this.ogrenciBilgiDurumu);
			setTimeout(() => {
				resolve(true);
			}, 1000);
		});
		console.log('promise', promise);
		return promise;
	}
	getSwal(url?: string) {
		if (url) {
			Swal.fire({
				text: this.translate.instant("TEXT.OPERATION_FAILED"),
				html: this.translate.instant("TEXT.REQUIREDDATA"),
				icon: 'error',
				showConfirmButton: true,
				allowOutsideClick: false
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.close();
					this.router.navigateByUrl(url);
				}
			});
		} else {
			Swal.fire({
				title: this.translate.instant("TEXT.LOADING"),
				timer: 10000,
				timerProgressBar: true,
				allowOutsideClick: false,
				didOpen: () => {
					Swal.showLoading();
				}
			});
		}

	}
	viewModal(data) {
		console.log('Görüntüleme verisi', data);

		const dialogRef = this.dialog.open(BasvuruGoruntulemeComponent, {
			data,
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
