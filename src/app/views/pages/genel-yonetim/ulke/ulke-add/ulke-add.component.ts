import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { UlkeListComponent } from '../ulke-list/ulke-list.component';

@Component({
  selector: 'kt-ulke-add',
  templateUrl: './ulke-add.component.html',
  styleUrls: ['./ulke-add.component.scss']
})
export class UlkeAddComponent implements OnInit {

  ulkeTanimForm: FormGroup;

  protected name: string = "ulke";
  loading = false;
  buttonSave: string = this.translate.instant('TEXT.SAVE');
  constructor(private fb: FormBuilder,
		private translate: TranslateService,

    public dialogRef: MatDialogRef<UlkeListComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.initRegisterForm();

  }


  initRegisterForm() {

    this.ulkeTanimForm = this.fb.group({
      adi_tr:    ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      adi_en:   ['', Validators.compose([Validators.maxLength(100)])],
      kodu:     ['', Validators.compose([Validators.maxLength(4)])]


    });


    if (this.data.id) {
      this.buttonSave =this.translate.instant('TEXT.UPDATE');

      this.ulkeTanimForm.addControl("id", new FormControl());

      this.ulkeTanimForm.setValue({
	  		id:this.data.id,
        adi_tr   : this.data.adi_tr,
        adi_en   : this.data.adi_en,
        kodu    : this.data.kodu

      });

    }

  }



  submit() {

    const controls = this.ulkeTanimForm.controls;
    /** check form */
    if (this.ulkeTanimForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.dialogRef.close({
      data: this.ulkeTanimForm.value
    });

  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.ulkeTanimForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
