import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { BirimYonetimService } from '../../../../../views/services/birim_yonetim.service';

@Component({
  selector: 'kt-dil-sinav-add',
  templateUrl: './dil-sinav-add.component.html',
  styleUrls: ['./dil-sinav-add.component.scss']
})

export class DilSinavAddComponent implements OnInit {

  dilSinavForm: FormGroup;
  hasFormErrors = false;
  loading = false;
  data: any;

  buttonSave: string = this.translate.instant("TEXT.SAVE");

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private BirimYonetimService: BirimYonetimService,
    private layoutUtilsService: LayoutUtilsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

    this.data = this.router.getCurrentNavigation().extras.state;

  }

  ngOnInit(): void {
    this.initRegisterForm();

  }

  initRegisterForm() {

    this.dilSinavForm = this.fb.group({

      adi_tr: ["", Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(2)])],
      adi_en: ["", Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(2)])],
      seviyeler: ["", Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(2)])],
      kodu: ["", Validators.compose([Validators.required, Validators.maxLength(10)])],
      dil_kodu: ["", Validators.compose([Validators.required, Validators.maxLength(10)])],
      durumu: [true],

    });

    if (this.data) {
      this.buttonSave = this.translate.instant('TEXT.UPDATE')
      this.dilSinavForm.addControl("id", new FormControl());
      const controls = this.dilSinavForm.controls;
      Object.keys(controls).forEach(controlName => {
        controls[controlName].setValue(this.data[controlName])
      });
      this.durumuText = this.data.durumu ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
    }
  }

  ObjectContorls() {
    const controls = this.dilSinavForm.controls;
    return Object.keys(controls);
  }

  ifTextBox(item): boolean {
    if (item == "durumu" || item == "id") {
      return false;
    }
    else {
      return true;
    }

  }
  onSumbit() {

    var data = this.dilSinavForm.value;
    //  return;
    const _messageType = data.id ? MessageType.Update : MessageType.Create;
    this.BirimYonetimService.saveLangExam(data).subscribe(res => {
      // console.log('resunit save : ',res)
      if (res.result) {
        let saveMessageTranslateParam = data.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');
        this.goBackWithoutId();
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
      }
    });

  }

  durumuText: string = this.translate.instant("TEXT.ACTIVE");
  //1 durum 
  changeStatu() {
    this.durumuText = this.durumuText == this.translate.instant("TEXT.PASSIVE") ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
  }

  goBack(id) {
    const url = `/ecommerce/products?id=${id}`;
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }

  goBackWithoutId() {
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

  getComponentTitle() {
    let result = this.translate.instant("TITLE.dil_sinav_tanim");
    return result;
  }

  isContorlMessage(saveMessageTranslateParam: string, name) {
    return this.translate.instant(saveMessageTranslateParam, { name: name });
  }

  /**
 * Checking control validation
 *
 * @param controlName: string => Equals to formControlName
 * @param validationType: string => Equals to valitors name
 */

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.dilSinavForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  submit() {

    const controls = this.dilSinavForm.controls;
    /** check form */
    if (this.dilSinavForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

  }

}
