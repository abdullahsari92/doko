import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '../../../../../core/services/translate.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SablonListComponent } from '../sablon-list/sablon-list.component';
import { ReportService } from '../../../../../views/services/report.service';

@Component({
  selector: 'kt-sablon-edit',
  templateUrl: './sablon-edit.component.html',
  styleUrls: ['./sablon-edit.component.scss']
})
export class SablonEditComponent implements OnInit {

  sablonEditForm: FormGroup;
  loading = false;
  buttonSave: string = this.translate.instant('TEXT.UPDATE');
  //stimulSablonModel: StimulSablonModel = new StimulSablonModel()

  dilKodlari = [
    { value: 'tr', key: this.translate.instant("LANGUAGE.tr") },
    { value: 'en', key: this.translate.instant("LANGUAGE.en") },
    { value: 'ch', key: this.translate.instant("LANGUAGE.ch") },
    { value: 'sp', key: this.translate.instant("LANGUAGE.sp") },
    { value: 'ge', key: this.translate.instant("LANGUAGE.ge") },
    { value: 'ja', key: this.translate.instant("LANGUAGE.ja") },
    { value: 'fr', key: this.translate.instant("LANGUAGE.fr") },
  ];

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<SablonListComponent>,
    private ReportService: ReportService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {

    this.sablonEditForm = this.fb.group({
      //id: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      adi: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],
      dil: ['', Validators.compose([Validators.required, Validators.maxLength(3)])],
      durumu: [true, Validators.compose([Validators.required])],
    });

    console.log('this.data.id', this.data.id);

    this.sablonEditForm.addControl("id", new FormControl());

    this.ReportService.getReportId(this.data.id).subscribe(res => {
      console.log('res.', res);
      console.log('res.data', res.data);

      if (res) {
        this.buttonSave = this.translate.instant('TEXT.UPDATE');
        this.sablonEditForm.setValue({
          id: this.data.id,
          adi: res.data.adi,
          dil: res.data.dil,
          durumu: res.data.durumu,
        });
        this.durumuText = res.data.durumu ? this.translate.instant('TEXT.ACTIVE') : this.translate.instant('TEXT.PASSIVE');

      }
    });

  }

  submit() {

    const controls = this.sablonEditForm.controls;
    /** check form */
    if (this.sablonEditForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.dialogRef.close({
      data: this.sablonEditForm.value
    });

  }

  durumuText: string = this.translate.instant("TEXT.PASSIVE");

  changeStatu(e) {
    if (e == 1) { this.durumuText = this.durumuText == this.translate.instant("TEXT.PASSIVE") ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE"); }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.sablonEditForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
