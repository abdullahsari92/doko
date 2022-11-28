import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '../../../../../core/services/translate.service';
import { IstenenDillerListComponent } from '../istenen-diller-list/istenen-diller-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

@Component({
  selector: 'kt-istenen-diller-add',
  templateUrl: './istenen-diller-add.component.html',
  styleUrls: ['./istenen-diller-add.component.scss']
})
export class IstenenDillerAddComponent implements OnInit {

 
  istenenDillerForm: FormGroup;

  protected name: string = "ulke";
  loading = false;
  buttonSave: string = this.translate.instant("TEXT.SAVE"); 
  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private route:ActivatedRoute,
		private router: Router,



    public dialogRef: MatDialogRef<IstenenDillerListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.initRegisterForm();
  }


  initRegisterForm() {


    this.istenenDillerForm = this.fb.group({
      durumu:   [true],
      dil_kodu:     ['', Validators.compose([Validators.maxLength(4)])],
    });

    if (this.data.id) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE');

      this.istenenDillerForm.addControl("id", new FormControl());

      this.istenenDillerForm.setValue({
	  		id:this.data.id,
        durumu   : this.data.durumu,
        dil_kodu    : this.data.dil_kodu
      });
      this.durumuText =  this.data.durumu?this.translate.instant("TEXT.ACTIVE"):this.translate.instant("TEXT.PASSIVE");

    }
  }

  submit() {

    const controls = this.istenenDillerForm.controls;
    /** check form */
    if (this.istenenDillerForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.dialogRef.close({
      data: this.istenenDillerForm.value
    });

  }
  durumuText:string=this.translate.instant("TEXT.ACTIVE");
  changeStatu()
  {    
        this.durumuText =  this.durumuText ==this.translate.instant("TEXT.PASSIVE") ?this.translate.instant("TEXT.ACTIVE"):this.translate.instant("TEXT.PASSIVE"); 
  }


  

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.istenenDillerForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
