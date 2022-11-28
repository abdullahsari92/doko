import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { BirimYonetimService } from '../../../../../views/services/birim_yonetim.service';
import { keyValue } from '../../../../../core/models/keyValue';

@Component({
  selector: 'kt-bolum-add',
  templateUrl: './bolum-add.component.html',
  styleUrls: ['./bolum-add.component.scss']
})
export class BolumAddComponent implements OnInit {

  bolumForm: FormGroup;
  hasFormErrors = false;
  loading = false;
  data: any;
  buttonSave: string = this.translate.instant("TEXT.SAVE");
  selected: any;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private BirimYonetimService: BirimYonetimService,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
  ) {
    this.data = this.router.getCurrentNavigation().extras.state
  }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.getFakulteler();
    this.bolumForm = this.fb.group({
      adi_tr: ["", Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(2)])],
      adi_en: ["", Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(2)])],
      kodu: ["", Validators.compose([Validators.required, Validators.maxLength(4)])],
      kontenjan: ["", Validators.compose([Validators.required, Validators.maxLength(3)])],
      //fakulte_kodu: ["", Validators.compose([Validators.required])],
      fakulte_id: ["", Validators.compose([Validators.required])],
      durumu: [true],
    });
    if (this.data) {
      console.log('this.data fakl',this.data);
      this.buttonSave = this.translate.instant('TEXT.UPDATE')
      this.bolumForm.addControl("id", new FormControl());
      const controls = this.bolumForm.controls;
      Object.keys(controls).forEach(controlName => {
        controls[controlName].setValue(this.data[controlName])
      });
      this.durumuText = this.data.durumu ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
    }
  }

  ObjectContorls() {
    const controls = this.bolumForm.controls;
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

  fakulteKodlari: keyValue[] = []
  getFakulteler() {
    this.BirimYonetimService.getListFaculty().subscribe(res => {
      if (res.result) {
        res.data.forEach(element => {
          var fakulte = new keyValue();
          fakulte.key = element.adi_tr;
          fakulte.value = element.id;
          fakulte.group = element.kodu;
          this.fakulteKodlari.push(fakulte);
        });
      }
      console.log(this.fakulteKodlari);
    })
  }

  onSumbit() {
    var data = this.bolumForm.value;
    console.log('data', data);
    const _messageType = data.id ? MessageType.Update : MessageType.Create;
    this.BirimYonetimService.saveDepartment(data).subscribe(res => {
      console.log('res', res);
      if (res) {
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
    let result = this.translate.instant("TITLE.bolum_tanim");
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
    const control = this.bolumForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
