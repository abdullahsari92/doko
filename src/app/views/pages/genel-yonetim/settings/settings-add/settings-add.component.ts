import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { SettingsListComponent } from '../settings-list/settings-list.component';

@Component({
  selector: 'kt-settings-add',
  templateUrl: './settings-add.component.html',
  styleUrls: ['./settings-add.component.scss']
})
export class SettingsAddComponent implements OnInit {

  settingsTanimForm: FormGroup;
  protected name: string = "settings";
  loading = false;
  buttonSave: string = this.translate.instant('TEXT.SAVE');

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<SettingsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {

    this.settingsTanimForm = this.fb.group({
      settingKey: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      settingValue: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],

    });

    if (this.data.id) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE');
      this.settingsTanimForm.addControl("id", new FormControl());
      this.settingsTanimForm.setValue({
        id: this.data.id,
        settingKey: this.data.settingKey,
        settingValue: this.data.settingValue,
        description: this.data.description
      });
    }

  }

  submit() {

    const controls = this.settingsTanimForm.controls;
    /** check form */
    if (this.settingsTanimForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.dialogRef.close({
      data: this.settingsTanimForm.value
    });

  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.settingsTanimForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
