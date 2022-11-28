import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../core/services/translate.service';
import { finalize, tap } from 'rxjs/operators';
import { StudentService } from '../../services/student.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';
import { DokoSettingsService } from '../../../core/services/doko-settings.service';
import { IdentityStudentService } from '../../services/identity-student.service';
import { TextDisplayComponent } from '../ogrenci-basvuru/text-display/text-display.component';
import { BasvuruTurEnum } from '../../../core/Enums/BasvuruTurEnum';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../services/shared.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subscription } from 'rxjs';

@Component({
	selector: 'kt-menu',
	templateUrl: './menu.component.html',
	styleUrls: [
		'./menu.component.scss',
	]
})
export class MenuComponent implements OnInit {
	//Tanımlar Başlangıç
	public menuBar: boolean = false;
	//Tanımlar Bitiş

	//Diziler Başlangıç
	public aktifIslemler: any[] = [];
	public genelBildirimler: any[] = [];
	public basvuruTurEnum = BasvuruTurEnum;
	//Diziler Bitiş

	//Bağlı Durumlar Başlangıç
	private clickEventsubscription: Subscription;
	public basvuru_tur: number = null;
	public userImage: string = null;
	public image: string = null;
	public nameLastName: string = null;
	public email: string = null;
	public bildirimDurumu: boolean = false;
	//Bağlı Durumlar Bitiş

	constructor(
		private sharedService: SharedService,
		private dialog: MatDialog,
		private studentService: StudentService,
		private cdr: ChangeDetectorRef,
		private localStorage: LocalStorageService,
		private router: Router,
		public translate: TranslateService,
		private dokoSettingsService: DokoSettingsService,
		private localStorageService: LocalStorageService,
		private identityStudentService: IdentityStudentService
	) {
		this.clickEventsubscription = this.sharedService.selectedProduct.subscribe((value) => {//98: menüyü göster 97: buton aktif durum 99: bildirim
			console.log('snc', value);
			if (value == 98) {
				if (this.menuBar) {
					this.menuBar = false;
				} else {
					this.menuBar = true;
				}
			} else if (value == 96) {
				this.menuBar = false;
			} else if (value == 99) {
				this.basvuru_tur = null;
				this.notifications(null);
				this.menuBar = false;
			} else {
				this.basvuru_tur = value;
				this.notifications(this.basvuru_tur);
			}
		});

		this.getBirimIslemListesi();
	}
	ngOnInit(): void {
		this.getInfo();
		this.notifications();
		this.clickEventsubscription = this.sharedService.selectedProduct2.subscribe((value) => {
			console.log('Menüde', value);
			this.getInfo();
		});
	}
	getInfo() {
		this.studentService
			.generalInfo()
			.pipe(
				tap(res => {
					if (res.result) {
						this.image = ((res.data.resim) == null || res.data.resim == '' ? './assets/student/dashboard/media/users/' + ((res.data.cinsiyet == 'E') ? '001-boy' : '010-girl-4') + '.svg' : this.dokoSettingsService.apiUrl + res.data.resim);
						this.nameLastName = (res.data.adi) + ' ' + (res.data.soyadi);
						this.email = res.data.eposta;
					}
				}),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	getBirimIslemListesi() {
		this.aktifIslemler = [];
		/* let islemler = this.localStorageService.getUnitReferenceModule();
		console.log("aktifIslemler", islemler); */

		this.studentService
			.getBirimIslemListesi()
			.pipe(
				tap(rest => {
					console.log('getBirimIslemListesi', rest);
					if (rest.result) {
						Object.keys(rest.data).forEach((value) => {
							if (rest.data[value]) {
								this.aktifIslemler.push(value);
							}
						});
					}
				}),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	aktifIslem(islem): any {
		let durum = (this.aktifIslemler).filter(y => y == islem);
		return durum.length > 0 ? true : false;
	}
	notifications(basvuru_turu?: number) {
		this.genelBildirimler = [];
		this.studentService
			.studentNotifications(basvuru_turu)
			.pipe(
				tap(res => {
					if (res.result) {
						this.bildirimDurumu = true;
						Object.keys(res.data).forEach((key) => {
							if (res.data[key]) {
								this.genelBildirimler.push(res.data[key])
							}
						});
					} else {
						this.bildirimDurumu = false;
					}
				}),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	sekmeSec() {
		this.sharedService.sendClickEvent(99);// Başvuru türü 4 tane şu anda. Anasayfa 99 olarak rastgele belirlendi.
		this.menuBarClose();
	}
	openModal(id: number) {
		let bildirim = this.genelBildirimler.filter(b => b.id == id);
		var title = bildirim[Object.keys(bildirim)[0]]['turu'] == 0 ? this.translate.instant("TEXT.GENERAL_NOTICE") : this.translate.instant("TEXT.SPECIAL_NOTICE");
		var data = { title: title, text: (bildirim[Object.keys(bildirim)[0]]['mesaj']), parametre: null, bildirim_id: null };
		if (bildirim[Object.keys(bildirim)[0]]['turu'] != 0) {
			data.parametre = 'bildirim';
			data.bildirim_id = id;
		}
		const dialogRef = this.dialog.open(TextDisplayComponent, { data, width: "40%", minWidth: "310px", maxHeight: "300px" });

		dialogRef.afterClosed().subscribe(refData => {
			if (refData !== undefined && refData.onay !== undefined && refData.onay) {
				this.bildirimOnayla(refData.id);
			}
		});
	}
	bildirimOnayla(id: number) {
		Swal.fire({
			text: this.translate.instant("TEXT.INFORM"),
			html: this.translate.instant("TEXT.CONFIRM_NOTIFICATIONS"),
			icon: 'question',
			showConfirmButton: true,
			allowOutsideClick: false,
			confirmButtonColor: '#3085d6',
			confirmButtonText: this.translate.instant("TEXT.onay"),
			showCancelButton: true,
			cancelButtonColor: '#d33',
			cancelButtonText: this.translate.instant("TEXT.CANCEL")
		}).then((result) => {
			if (result.isConfirmed) {
				this.studentService
					.confirmNotifications(id)
					.pipe(
						tap(res => {
							console.log('bildirim', res);
							if (res.result) {
								this.notifications(this.basvuru_tur);
								Swal.fire({
									text: this.translate.instant('TEXT.UPDATE_SUCCESSFUL'),
									icon: 'success',
									showConfirmButton: false,
									timer: 2500
								});
							} else {
								Swal.fire({
									title: this.translate.instant("TEXT.OPERATION_FAILED"),
									text: this.translate.instant(res.error.message),
									icon: 'error',
									showConfirmButton: true
								});/* .then((result) => {
									if (result.isConfirmed) {
										this.dialogRef.close();
									}
								}); */
							}
						}),
						finalize(() => {
							this.cdr.markForCheck();
						})
					)
					.subscribe();
			}
		});
	}
	menuBarClose() {
		this.menuBar = false;
		this.sharedService.sendClickEvent(97);
	}
	signOut() {
		this.localStorage.removeItem('student_data');
		this.identityStudentService.remove();
		this.router.navigateByUrl('/login');
	}
}
