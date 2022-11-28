import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { BankaListComponent } from '../banka-list/banka-list.component';

@Component({
	selector: 'kt-banka-add',
	templateUrl: './banka-add.component.html',
	styleUrls: ['./banka-add.component.scss']
})

export class BankaAddComponent implements OnInit {

	BankaTuru = [
		{ value: 1, text: 'Ziraat Online', key: 'ziraat' },
		{ value: 2, text: 'Ziraat Online Test', key: 'ziraat' },
	];

	ziraatparametre =
		[
			{ key: 1, text: 'clientid' },
			{ key: 1, text: 'storekey' },
			{ key: 1, text: 'storetype' },
			{ key: 1, text: 'transactionType' },
		];

	bankaTanimForm: FormGroup;
	ziraatForm: FormGroup;
	protected name: string = "banka";
	loading = false;
	buttonSave: string = this.translate.instant('TEXT.SAVE');
	constructor(
		private fb: FormBuilder,
		private translate: TranslateService,
		public dialogRef: MatDialogRef<BankaListComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit(): void {

		this.initRegisterForm();
	}

	ObjectContorls() {
		const controls = this.bankaTanimForm.controls;
		return Object.keys(controls);
	}

	ZiraatContorls() {
		const controls = this.ziraatForm.controls;
		return Object.keys(controls);
	}

	initRegisterForm() {

		this.bankaTanimForm = this.fb.group({
			//id: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			turu: [, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11)])],
			adi: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
			parametreler: [''],

		});

		this.ziraatForm = this.fb.group({});
		this.ziraatparametre.forEach(m => {
			var id = m.text + '_id';
			this.ziraatForm.addControl(id, new FormControl({ value: m.text, disabled: true }, Validators.required));
			this.ziraatForm.addControl(m.text, new FormControl());
		});

		if (this.data.id) {
			this.buttonSave = this.translate.instant('TEXT.UPDATE');

			this.bankaTanimForm.addControl("id", new FormControl())
			this.bankaTanimForm.setValue({
				id: this.data.id,
				turu: this.data.turu,
				adi: this.data.adi,
				parametreler: '',

			})

			const Parametre = JSON.parse(this.data.parametreler);
			this.ziraatparametre.forEach(m => {
				var id = m.text + '_id';
				this.ziraatForm.setControl(id, new FormControl({ value: m.text, disabled: true }, Validators.required));
				this.ziraatForm.setControl(m.text, new FormControl(Parametre[m.text]));
			});

		}

	}

	isContorlMessage(saveMessageTranslateParam: string, name: any) {
		//this.authNoticeService.setNotice(this.translate.instant('VALIDATION.NOT_FOUND', {name: this.translate.instant('TEXT.eposta')}), 'danger');

		//console.log(' bankaValid:',this.translate.instant(saveMessageTranslateParam, {name: name}));
		return this.translate.instant(saveMessageTranslateParam, { name: name });

	}

	/**
 * Checking control validation
 *
 * @param controlName: string => Equals to formControlName
 * @param validationType: string => Equals to valitors name
 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.bankaTanimForm.controls[controlName];
		if (!control) {
			return false;
		}
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	submit() {

		const controls = this.bankaTanimForm.controls;

		var parametrejson = JSON.stringify(this.ziraatForm.value);
		this.bankaTanimForm.get("parametreler").setValue(parametrejson);
		/** check form */
		if (this.bankaTanimForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
		}

		this.dialogRef.close({
			data: this.bankaTanimForm.value,
		});


	}

	ngOnChanges() {

		this.name = "banka";

	}
}
