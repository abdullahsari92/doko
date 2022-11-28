import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { KonsoloslukListComponent } from '../../konsolosluk/konsolosluk-list/konsolosluk-list.component';

@Component({
  selector: 'kt-kurum-add',
  templateUrl: './kurum-add.component.html',
  styleUrls: ['./kurum-add.component.scss']
})
export class KurumAddComponent implements OnInit {

  kurumTanimForm: FormGroup;

  protected name: string = "kurum";
  loading = false;
  buttonSave: string = this.translate.instant('TEXT.SAVE');
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<KonsoloslukListComponent>,
		private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.initRegisterForm();
  }

  initRegisterForm() {

    this.kurumTanimForm = this.fb.group({
      //id: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      ilgili_kisi: ['', Validators.compose([Validators.required, Validators.maxLength(70)])],
      adi:    ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
      adres:   ['', Validators.compose([Validators.maxLength(200)])],
      telefon:     ['', Validators.compose([Validators.maxLength(20),
        Validators.pattern('(0[0-9]{3}\\s)+([0-9]{3}\\s)+([0-9]{2}\\s)+([0-9]{2})')
      ])],
      email:     ['', Validators.compose([ Validators.email , Validators.maxLength(100)])],
    });
  
    if (this.data.id) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE');

      this.kurumTanimForm.addControl("id", new FormControl());

      this.kurumTanimForm.setValue({
	  		id:this.data.id,
        ilgili_kisi  :   this.data.ilgili_kisi,
        adi   : this.data.adi,
        adres   : this.data.adres,
        telefon    : this.data.telefon,
        email    : this.data.email
      });

    }
  }

  ObjectContorls()
  {
    const controls = this.kurumTanimForm.controls;

    var object = Object.keys(controls)
    .filter(p=> p !="telefon")
    .filter(p=> p !="id");

      

   
    
    return object;
  }

  submit() {

    const controls = this.kurumTanimForm.controls;
    /** check form */
    if (this.kurumTanimForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.dialogRef.close({
      data: this.kurumTanimForm.value
    });

  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.kurumTanimForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
