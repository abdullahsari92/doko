import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Output, Input, EventEmitter } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { finalize, tap } from 'rxjs/operators';
import { TranslateService } from '../../../../core/services/translate.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ControlContainer, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';
import { VisaAdditionalActionsComponent } from './visa-additional-actions/visa-additional-actions.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'kt-visa-information',
	templateUrl: './visa-information.component.html',
	styleUrls: ['./visa-information.component.scss',],
	encapsulation: ViewEncapsulation.None
})

export class VisaInformationComponent implements OnInit {
	public form!: FormGroup;
	public formControl!: FormControl;

	@Input() vize_durumu!: string;
	@Input() vize_ulke_kodu!: string;
	@Input() vize_konsolosluk_kodu!: string;

	public vizeVerileri: any = {
		'vize_durumu': null,
		'vize_ulke_kodu': null,
		'vize_konsolosluk_kodu': null
	};

	ulkeler: any[] = [];
	vizeUlkeleri: any[] = [];

	constructor(
		private studentService: StudentService,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private localStorageService: LocalStorageService,
		private dialog: MatDialog,
		private controlContainer: ControlContainer
	) { }
	ngOnInit(): void {
		this.getUlkeler();
		this.getVizeler();

		this.form = <FormGroup>this.controlContainer.control;
		this.formControl = <FormControl>this.form.get(this.vize_durumu);
		this.formControl = <FormControl>this.form.get(this.vize_ulke_kodu);
		this.formControl = <FormControl>this.form.get(this.vize_konsolosluk_kodu);

		Object.keys(this.vizeVerileri).forEach((key) => {
			this.vizeVerileri[key] = this.form.get(key).value;
		});

		console.log('gelen veri', this.vizeVerileri);
		
	}
	getVizeler() {
		this.studentService
			.visaInfo()
			.pipe(
				tap(res => {
					res.data.forEach(vals => {
						this.vizeUlkeleri.push({
							'ulke_kodu': vals.ulke_kodu,
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
			.subscribe();
		console.log('vize tanımları', this.vizeUlkeleri);

	}
	getVizeAdi(kod: number) {
		if (this.vizeUlkeleri.length > 0) {
			let vizeAdi = this.vizeUlkeleri.filter(x => x.kodu == kod)[0];
			return vizeAdi ? vizeAdi : false;
		}
		return false;
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
	vizeModal() {
		let dialogRef = this.dialog.open(VisaAdditionalActionsComponent, {
			width: '32%',
			maxHeight: '80vh',
			data: {
				vizeBilgisi: this.vizeVerileri,
				ulkeBilgisi: this.ulkeler,
				vizeUlkeBilgisi: this.vizeUlkeleri
			},
			autoFocus: false
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result !== undefined) {
				console.log('dönüş değeri', result);
				if (result.vizeEkle !== undefined && result.vizeEkle) {
					this.getVisaInformation(result);
				} else if (result.vizeGuncelle !== undefined && result.vizeGuncelle) {
					this.getVisaInformation(result);
				} else if (result.vizeSil !== undefined && result.vizeSil) {
					this.getVisaInformation(result);
				}
			}
		})
	}
	getVisaInformation(data) {
		Object.keys(data.vizeVerileri).forEach((key) => {
			this.vizeVerileri[key]= data.vizeVerileri[key];
			this.form.get(key).setValue(data.vizeVerileri[key]);
		});
		this.cdr.markForCheck();
	}
}
