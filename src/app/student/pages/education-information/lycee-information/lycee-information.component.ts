import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { finalize, tap } from 'rxjs/operators';
import { TranslateService } from '../../../../core/services/translate.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LyceeAdditionalActionsComponent } from './lycee-additional-actions/lycee-additional-actions.component';
import { LocalStorageService } from '../../../../student/services/local-storage.service';

import Swal from 'sweetalert2';

@Component({
	selector: 'kt-lycee-information',
	templateUrl: './lycee-information.component.html',
	styleUrls: ['./lycee-information.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LyceeInformationComponent implements OnInit {
	@Output() liseDurumu = new EventEmitter<boolean>();
	public dataState: boolean = true;
	ulkeler: any[] = [];
	lyceeInfo = [];

	constructor(
		private studentService: StudentService,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private localStorageService: LocalStorageService,
		private dialog: MatDialog
	) { }
	ngOnInit(): void {
		this.getUlkeler();
		this.gethighSchool();
	}
	liseModal(id?: number) {
		let data;
		if (id !== undefined) {
			data = this.lyceeInfo.filter(key => key.id === id);
			if (data !== null) {
				data = data[0];
			}
		}
		let dialogRef = this.dialog.open(LyceeAdditionalActionsComponent, {
			width: '32%',
			maxHeight: '80vh',
			data: {
				id: id,
				liseBilgisi: data,
				ulkeler: this.ulkeler
			},
			autoFocus: false
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result !== undefined) {
				if (result.liseEkle !== undefined && result.liseEkle) {
					this.gethighSchool();
				} else if (result.liseGuncelle !== undefined && result.liseGuncelle) {
					this.gethighSchool();
				} else if (result.liseSil !== undefined && result.liseSil) {
					this.gethighSchool();
					document.getElementById(result.silinenID).remove();
				}
			}
		})
	}
	gethighSchool() {
		this.studentService
			.high_school_get_list()
			.pipe(
				tap(rest => {
					if (rest.result) {
						this.dataState = true;
						this.liseDurumu.emit(true);
						this.lyceeInfo = rest.data;
					} else {
						this.liseDurumu.emit(false);
						this.dataState = false;
					}
				}),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
	getUlkeler() {
		if (this.localStorageService.getCountryList()) {
			this.ulkeler = this.localStorageService.getCountryList();
		}
	}
	getUlkeAdi(kod: string) {
		if (this.ulkeler.length > 0) {
			return this.ulkeler.filter(x => x.kodu == kod)[0];
		}
		return false;
	}

}
