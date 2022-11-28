import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Output, Input, EventEmitter } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { finalize, tap } from 'rxjs/operators';
import { TranslateService } from '../../../../core/services/translate.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LanguageAdditionalActionsComponent } from './language-additional-actions/language-additional-actions.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
	selector: 'kt-language-information',
	templateUrl: './language-information.component.html',
	styleUrls: ['./language-information.component.scss',],
	encapsulation: ViewEncapsulation.None
})

export class LanguageInformationComponent implements OnInit {
	//Input Başlangıç
	@Input() basvuruID = new EventEmitter<number>();
	@Input() routerBasvuruID = new EventEmitter<number>();// url üzerinden geldiğinde kullanılmalı
	//Input Bitiş

	//Output Başlangıç
	@Output() dilDurumu = new EventEmitter<boolean>();
	//Output Bitiş
	
	public dataState: boolean = true;
	dilSinavlari: any[] = [];
	langInfo = [];
	basvuru_id: any = null;

	constructor(
		private studentService: StudentService,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private localStorageService: LocalStorageService,
		private dialog: MatDialog,
		private router: Router
	) { }
	ngOnInit(): void {
		this.getDilSinavlari();

		if (typeof (this.basvuruID) == 'number' && this.basvuruID !== null) {
			this.basvuru_id = this.basvuruID;
		} else if (typeof (this.routerBasvuruID) != 'object' && this.routerBasvuruID !== null) {
			this.basvuru_id = this.routerBasvuruID;
		}
		this.getLanguageInformation();

	}
	dilModal(id?: number) {
		let data;
		if (id !== undefined) {
			data = this.langInfo.filter(key => key.id === id);
			if (data !== null) {
				data = data[0];
			}
		}
		let dialogRef = this.dialog.open(LanguageAdditionalActionsComponent, {
			width: '32%',
			maxHeight: '80vh',
			data: {
				id: id,
				dilBilgisi: data,
				dilSinavBilgisi: this.dilSinavlari,
				basvuru_id: this.basvuru_id
			},
			autoFocus: false
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result !== undefined) {
				if (result.dilEkle !== undefined && result.dilEkle) {
					this.getLanguageInformation();
					if (typeof (this.routerBasvuruID) != 'object' && this.routerBasvuruID !== null) {
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
							if (result.isConfirmed) {
								this.router.navigateByUrl('/homepage');
							}
						});
					}
				} else if (result.dilGuncelle !== undefined && result.dilGuncelle) {
					this.getLanguageInformation();
				} else if (result.dilSil !== undefined && result.dilSil) {
					this.getLanguageInformation();
					document.getElementById(result.silinenID).remove();
				}
			}
		})
	}
	getLanguageInformation() {
		this.studentService
			.language_get_list(this.basvuru_id)
			.pipe(
				tap(rest => {
					if (rest.result) {
						this.dataState = true;
						this.dilDurumu.emit(true);
						this.langInfo = rest.data;
					} else {
						this.dilDurumu.emit(false);
						this.dataState = false;
					}
				}),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	getDilSinavlari() {
		this.studentService
			.language_exams_get_list()
			.pipe(
				tap(rest => {
					if (rest.result) {
						this.dilSinavlari = rest.data;
					}
				}),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	getDilBilgileri(dil_id: number) {
		if (this.dilSinavlari.length > 0) {
			return this.dilSinavlari.filter(x => x.id == dil_id)[0];
		}
		return false;
	}
}
