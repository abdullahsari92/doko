import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm, Validators } from '@angular/forms';
import { TranslateService } from '../../../../core/services/translate.service';
import { DokoSettingsService } from '../../../../core/services/doko-settings.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NationalityInformationComponent } from '../nationality-information/nationality-information.component';
import { ErrorService } from '../../../services/error.service';
import { fieldValidations } from '../../../../core/Enums/fieldValidations';

@Component({
  selector: 'kt-additional-actions',
  templateUrl: './additional-actions.component.html',
  styleUrls: [
    './additional-actions.component.scss',
  ]
})
export class AdditionalActionsComponent implements OnInit {
  form: FormGroup;
  errorState: boolean = false;
  loading = false;

  //Enum Durumlar Başlangıç
  validations = fieldValidations;
  //Enum Durumlar Bitiş

  buttonSave: string = this.translate.instant('TEXT.SAVE');
  constructor(
    private translate: TranslateService,
    private errorService: ErrorService,
    public dokoSettingsService: DokoSettingsService,
    public dialogRef: MatDialogRef<NationalityInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.form = this.data.form;

    if (this.data.process === 1) {
      this.form.controls["mavi_kart_belge"].setValidators([
        Validators.required
      ]);
    } else {
      this.form.controls["pasaport2_no"].setValidators([
        Validators.required,
        Validators.pattern(this.validations.pasaport)
      ]);
      this.form.controls["pasaport2_dosya"].setValidators([
        Validators.required
      ]);
      this.form.controls["uyruk2_kodu"].setValidators([
        Validators.required,
        Validators.pattern(this.validations.kod10)
      ]);
      this.form.controls["uyruk2_sebebi_id"].setValidators([
        Validators.required,
        Validators.pattern(this.validations.sayisalKod1)
      ]);
    }
  }
  errorControl(input: string): any {
    let result = this.errorService.errorControl(input, this.form);
    if (input === '*') {
      this.errorState = result;
    } else {
      return result;
    }
  }
  submit() {
    this.errorControl("*");
    if (this.errorState == false) {
      if (this.data.process === 1) {
        this.dialogRef.close({ maviKart: true });
      } else {
        this.dialogRef.close({ uyruk2: true });
      }
    }
  }

}
