import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { DilListComponent } from '../dil-list/dil-list.component';

@Component({
  selector: 'kt-dil-add',
  templateUrl: './dil-add.component.html',
  styleUrls: ['./dil-add.component.scss']
})
export class DilAddComponent implements OnInit {

  dilTanimForm: FormGroup;
  protected name: string = "dil";
  loading = false;
  buttonSave: string = this.translate.instant('TEXT.SAVE');

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<DilListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {

    this.dilTanimForm = this.fb.group({
      //id: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      keyword: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      tr: ['', Validators.compose([Validators.required, Validators.maxLength(300)])],
      en: ['', Validators.compose([Validators.required, Validators.maxLength(300)])],
      fr: ['', Validators.compose([Validators.maxLength(300)])],
      ge: ['', Validators.compose([Validators.maxLength(300)])],
      sp: ['', Validators.compose([Validators.maxLength(300)])],
      ch: ['', Validators.compose([Validators.maxLength(300)])],
    });

    if (this.data.id) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE');
      this.dilTanimForm.addControl("id", new FormControl());
      this.dilTanimForm.setValue({
        id: this.data.id,
        keyword: this.data.keyword,
        tr: this.data.tr,
        en: this.data.en,
        fr: this.data.fr,
        ge: this.data.ge,
        sp: this.data.sp,
        ch: this.data.ch,
      });
    }

  }

  submit() {

    const controls = this.dilTanimForm.controls;
    /** check form */
    if (this.dilTanimForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.dialogRef.close({
      data: this.dilTanimForm.value
    });

  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.dilTanimForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
