import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { BirimYonetimService } from '../../../../../views/services/birim_yonetim.service';

@Component({
  selector: 'kt-egitim-donem-add',
  templateUrl: './egitim-donem-add.component.html',
  styleUrls: ['./egitim-donem-add.component.scss']
})
export class EgitimDonemAddComponent implements OnInit {

  egitimDonemForm: FormGroup;
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

    this.data = this.router.getCurrentNavigation().extras.state

  }

  ngOnInit(): void {

    this.initRegisterForm();
  }

  initRegisterForm() {    
    this.egitimDonemForm = this.fb.group({
      adi_tr: ["", Validators.compose([Validators.required, Validators.maxLength(400)])],
      adi_en: ["", Validators.compose([Validators.required, Validators.maxLength(400)])],
      obs_baslangic_kodu: ["", Validators.compose([Validators.required, Validators.maxLength(4)])],
      donem_yili: [new Date().getFullYear(), Validators.compose([Validators.required, Validators.maxLength(4)])],
      durumu: [true],
    });

    if (this.data) {
      this.egitimDonemForm.addControl("id", new FormControl());
      const controls = this.egitimDonemForm.controls;
      Object.keys(controls).forEach(controlName => {
        controls[controlName].setValue(this.data[controlName])
      });

      this.durumuText = this.data.durumu ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");

    }

  }

  ObjectContorls() {
    const controls = this.egitimDonemForm.controls;
    var object = Object.keys(controls).filter(p => p != "durumu").filter(p => p != "donem_yili").filter(p => p != "id");
    return object;
  }

  onSumbit() {

    var data = this.egitimDonemForm.value;

    const _messageType = data.id ? MessageType.Update : MessageType.Create;

    this.BirimYonetimService.saveTrainingPeriod(data).subscribe(res => {

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
  //2 kayit_turu
  //3 uyruk_bilgisi
  changeStatu() {
    this.durumuText = this.durumuText == this.translate.instant("TEXT.PASSIVE") ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
  }

  goBackWithoutId() {
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

  getComponentTitle() {
    let result = this.translate.instant("TITLE.egitim_donemi_tanim");
    //if (!this.product || !this.product.id) {
    return result;
    //	}

    //	result = `Edit product - ${this.product.manufacture} ${this.product.model}, ${this.product.modelYear}`;
  }

  isContorlMessage(saveMessageTranslateParam: string, name) {
    //this.authNoticeService.setNotice(this.translate.instant('VALIDATION.NOT_FOUND', {name: this.translate.instant('TEXT.eposta')}), 'danger');

    // console.log(' bankaValid:',this.translate.instant(saveMessageTranslateParam, {name: name}));
    return this.translate.instant(saveMessageTranslateParam, { name: name });
  }
  /**
 * Checking control validation
 *
 * @param controlName: string => Equals to formControlName
 * @param validationType: string => Equals to valitors name
 */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.egitimDonemForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  submit() {

    // console.log('this.yetkiTanimForm.value;',this.egitimDonemForm.value)
    // this.yetkiTanimForm.value;


    const controls = this.egitimDonemForm.controls;
    /** check form */
    if (this.egitimDonemForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }





  }
}
