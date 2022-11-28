import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LanguageInformationComponent } from '../language-information.component';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { fieldValidations } from '../../../../../core/Enums/fieldValidations';
import { keyValue } from '../../../../../core/models/keyValue';
import Swal from 'sweetalert2';
import { StudentService } from '../../../../services/student.service';
import { finalize, tap } from 'rxjs/operators';
import { ErrorService } from '../../../../services/error.service';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';
import { TranslateService } from '../../../../../core/services/translate.service';

@Component({
  selector: 'kt-language-additional-actions',
  templateUrl: './language-additional-actions.component.html',
  styleUrls: ['./language-additional-actions.component.scss']
})
export class LanguageAdditionalActionsComponent implements OnInit {
  public errorState: boolean = false;
  public btnAdi: string = 'SAVE';
  submitDisabled: boolean = false;
  islem: boolean = false;
  dilForm: FormGroup;
  validations = fieldValidations;
  dilSinavlari: any[] = [];
  constructor(
    private studentService: StudentService,
    public dokoSettingsService: DokoSettingsService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private errorService: ErrorService,
    public dialogRef: MatDialogRef<LanguageInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    console.log('data', this.data);
    this.islem = false;
    this.initForm();

    this.dilForm.get('basvuru_id').setValue(this.data.basvuru_id);
    if (this.data.dilSinavBilgisi) {
      this.dilSinavlari = this.data.dilSinavBilgisi;
    }
    if (this.data.id !== undefined && this.data.dilBilgisi !== undefined) {
      this.dilForm.addControl('id', new FormControl('', Validators.required));
      this.btnAdi = "UPDATE";
      Object.keys(this.dilForm.controls).forEach((key) => {
        this.dilForm.get(key).setValue(this.data.dilBilgisi[key]);
      });
    } else {
      this.islem = true;
    }
  }
  initForm() {
    this.dilForm = new FormGroup({
      basvuru_id: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.kod10)
      ]),
      dil_id: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.kod10)
      ]),
      dil_seviyesi: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validations.kod10)
      ]),
      dil_belgesi: new FormControl('', [
        Validators.required
      ]),
    });
  }
  errorControl(input: string): any {
    let result = this.errorService.errorControl(input, this.dilForm);
    if (input === '*') {
      this.errorState = result;
    } else {
      return result;
    }
  }
  dilSeviyeleri() {
    if (this.dilForm.get('dil_id').value) {
      let dilSinavi = this.dilSinavlari.filter(y => y.id == (this.dilForm.get('dil_id').value));
      return dilSinavi[0].seviyeler;
    }
  }
  dilEkle() {
    this.errorControl("*");
    if (this.errorState == false) {
      this.submitDisabled = true;
      this.studentService
        .language_save(this.dilForm.value)
        .subscribe(res => {
          if (res.result) {
            Swal.fire({
              text: this.translate.instant('TEXT.SAVE_SUCCESSFUL'),
              icon: 'success',
              showConfirmButton: false,
              timer: 2500
            });
            this.dialogRef.close({ 'dilEkle': res });
          } else {
            Swal.fire({
              text: this.translate.instant("TEXT.OPERATION_FAILED"),
              html: this.errorService.arrayError(res.error.message),
              icon: 'error',
              showConfirmButton: true
            });
          }
        });
    }
    this.submitDisabled = false;
    this.cdr.markForCheck();
  }
  dilGuncelle() {
    this.errorControl("*");
    if (this.errorState == false) {
      this.studentService
        .language_save(this.dilForm.value)
        .subscribe(res => {
          if (res.result) {
            Swal.fire({
              text: this.translate.instant("TEXT.UPDATE_SUCCESSFUL"),
              icon: 'success',
              showConfirmButton: false,
              timer: 2500
            });
            this.dialogRef.close({ 'dilGuncelle': res });
          } else {
            Swal.fire({
              text: this.translate.instant("TEXT.OPERATION_FAILED"),
              html: this.errorService.arrayError(res.error.message),
              icon: 'error',
              showConfirmButton: true
            });
          }
        });
    }
  }
  dilSil(id: number) {
    Swal.fire({
      title: this.translate.instant('TEXT.DELETE_WANT'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('TEXT.CANCEL'),
      confirmButtonText: this.translate.instant('TEXT.DELETE'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        let silinecekID = this.dilForm.get('id').value;
        this.studentService
          .language_delete(this.dilForm.value)
          .subscribe(rest => {
            if (rest.result) {
              Swal.fire({
                text: this.translate.instant("TEXT.DELETE_SUCCESSFUL"),
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
              });
              this.dialogRef.close({ 'dilSil': result, 'silinenID': silinecekID });
            } else {
              Swal.fire({
                text: this.translate.instant("TEXT.OPERATION_FAILED"),
                html: this.errorService.arrayError(rest.error.message),
                icon: 'error',
                showConfirmButton: true
              });
            }
          });
      }
    });

  }
  // Kayıt ve Güncelleme İşlemleri Bitiş
}
