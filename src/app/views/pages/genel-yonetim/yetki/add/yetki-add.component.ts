import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { LocalStorageService } from "../../../../../core/services/local-storage.service";
import { YetkiTanimService } from '../../../../services/yetki-tanim.service';
import { YetkiListComponent } from '../list/yetki-list.component';
import { YetkiGrupEnum } from '../../../../../core/Enums/yetkiGrupEnum';

@Component({
	selector: 'kt-yetki-add',
	templateUrl: './yetki-add.component.html',
	styleUrls: ['./yetki-add.component.scss']
})
export class YetkiAddComponent implements OnInit {

	yetkiTanimForm: FormGroup;
	loading = false;
	buttonSave: string = this.translate.instant("TEXT.SAVE");

	constructor(

		private fb: FormBuilder,
		private yetkiTanimService: YetkiTanimService,
		private localStorageService: LocalStorageService,
		public dialogRef: MatDialogRef<YetkiListComponent>,
		private translate: TranslateService,

		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit(): void {

		this.initRegisterForm();
	}

	addList: any[] = [];
	yetkiGroup() {

		for (var i in YetkiGrupEnum) {
			var liste = {
				value: YetkiGrupEnum[i], key: i,
			}
			this.addList.push(liste);
		}
	}

	ObjectContorls() {
		const controls = this.yetkiTanimForm.controls;

		return Object.keys(controls);
	}

	initRegisterForm() {

		this.yetkiGroup();

		this.yetkiTanimForm = this.fb.group({
			//id: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			yetki_kodu: ['', Validators.compose([Validators.maxLength(255)])],
			yetki_adi: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
			grup_adi: ['', Validators.compose([Validators.maxLength(255)])],
			unit_manager: [false, Validators.compose([Validators.required])],
			unit_manager_assistant: [false, Validators.compose([Validators.required])],
			agent_user: [false, Validators.compose([Validators.required])],
			unit_user: [false, Validators.compose([Validators.required])],
		});

		if (this.data.id) {
			this.buttonSave = this.translate.instant('TEXT.UPDATE');
			this.yetkiTanimForm.addControl("id", new FormControl())
			this.yetkiTanimForm.setValue({
				yetki_adi: this.data.yetki_adi,
				yetki_kodu: this.data.yetki_kodu,
				grup_adi: this.data.grup_adi,
				unit_manager: this.data.unit_manager,
				agent_user: this.data.agent_user,
				unit_manager_assistant: this.data.unit_manager_assistant,
				unit_user: this.data.unit_user,
				id: this.data.id
			})
		}

	}

	/**
 * Checking control validation
 *
 * @param controlName: string => Equals to formControlName
 * @param validationType: string => Equals to valitors name
 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.yetkiTanimForm.controls[controlName];
		if (!control) {
			return false;
		}
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	submit() {
		this.dialogRef.close({
			data: this.yetkiTanimForm.value
		});
	}


}
