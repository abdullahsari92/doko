import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { map } from 'rxjs/operators';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { birimBasvuru } from '../../../../../views/models/birimBasvuru';
import { BirimYonetimService } from '../../../../../views/services/birim_yonetim.service';
import { keyValue } from '../../../../../core/models/keyValue';
import { DatePipe } from '@angular/common';
import { BankaTanimService } from '../../../../../views/services/banka-tanim.service';

@Component({
  selector: 'kt-basvuru-add',
  templateUrl: './basvuru-add.component.html',
  styleUrls: ['./basvuru-add.component.scss']
})
export class BasvuruAddComponent implements OnInit {

  birimBasvuru: birimBasvuru;
  birimForm: FormGroup;
  hasFormErrors = false;
  loading = false;
  egitimDonemleri: keyValue[] = [];

  buttonSave: string = "Kaydet";
  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private BirimYonetimService: BirimYonetimService,
    public datepipe: DatePipe,
    private layoutUtilsService: LayoutUtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private bankaService: BankaTanimService,
  ) {
    this.birimBasvuru = this.router.getCurrentNavigation().extras.state as birimBasvuru;
  }

  basvuruTurleri = [
    { value: 1, key: "Sinav" },
    { value: 2, key: "Lisans" },
    { value: 3, key: "Yüksek Lisans" },
    { value: 4, key: "Doktora" },
  ];

  ucretOdemeTuru = [
    { value: 1, key: "Online" },
    { value: 2, key: "Dekont" }
  ]
  ucretOdemeZamani = [
    { value: 0, key: "Önce" },
    { value: 1, key: "Sonra" }
  ]

  ngOnInit(): void {

    this.initRegisterForm();
  }

  initRegisterForm() {

    this.getEgitimDonemi();
    this.getBankaTanimlari();
    this.birimForm = this.fb.group({

      adi_tr: ["", Validators.compose([Validators.required])],
      adi_en: ["", Validators.compose([Validators.required])],
      baslangic_tarihi: ["", Validators.compose([Validators.required, Validators.maxLength(2)])],
      bitis_tarihi: ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      ucret_son_odeme_tarihi: ["", Validators.compose([Validators.maxLength(100)])],
      ucret: ["", Validators.compose([Validators.maxLength(50)])],
      basvuru_turu: ["", Validators.compose([Validators.maxLength(500)])],
      egitim_donemi_id: ["", Validators.compose([Validators.required])],
      dil_bilgisi_durumu: [false, Validators.compose([Validators.required])],
      vize_bilgisi_durumu: [false, Validators.compose([Validators.required])],
      ucret_odeme_turu: [-1, Validators.compose([Validators.required])],
      odeme_bankasi: ["0", Validators.compose([Validators.required])],
      durumu: [false, Validators.compose([Validators.required])],
      kullanim_kosulu_metni_tr: ["", Validators.compose([Validators.required])],
      kullanim_kosulu_metni_en: ["", Validators.compose([Validators.required])],
      ucret_zamani: [0],
      uyruk_bilgisi_durumu: [false, Validators.compose([Validators.required])],
      kayit_turu_durumu: [false, Validators.compose([Validators.required])],
      ucret_aciklama_tr: [""],
      ucret_aciklama_en: [""],

    });

    if (this.birimBasvuru) {

      this.birimForm.addControl("id", new FormControl());
      const controls = this.birimForm.controls;
      Object.keys(controls).forEach(controlName => {
        controls[controlName].setValue(this.birimBasvuru[controlName])
      });

      controls["baslangic_tarihi"].setValue(new Date(this.birimBasvuru.baslangic_tarihi));
      controls["bitis_tarihi"].setValue(new Date(this.birimBasvuru.bitis_tarihi));
      controls["ucret_son_odeme_tarihi"].setValue(new Date(this.birimBasvuru.ucret_son_odeme_tarihi));

      this.durumuText = this.birimBasvuru.durumu ? 'TEXT.TRUE' : 'TEXT.FALSE';
      this.kayit_turu = this.birimBasvuru.kayit_turu_durumu ? 'TEXT.TRUE' : 'TEXT.FALSE';
      this.uyruk_bilgisi = this.birimBasvuru.uyruk_bilgisi_durumu ? 'TEXT.TRUE' : 'TEXT.FALSE';
    }

  }

  getEgitimDonemi() {
    this.BirimYonetimService.getListTrainingPeriod().pipe(map(m => {
      m.data.forEach(element => {
        var deger = new keyValue();
        deger.key = element.adi_tr;
        deger.value = element.id
        this.egitimDonemleri.push(deger);
      });
    })).subscribe();

  }

  bankaList: keyValue[] = []
  getBankaTanimlari() {
    this.bankaService.getList().subscribe(res => {
      if (res.result) {
        var banka = { key: "Seçiniz", value: "-1", selected: false }
        this.bankaList.push(banka)
        res.data.forEach(m => {
          var banka = { key: m.adi, value: m.id, selected: false }
          this.bankaList.push(banka)
        });
      }
    })

  }

  ObjectContorlsDeneme() {
    const controls = this.birimForm.controls;
    return Object.keys(controls);
  }

  ObjectContorls() {
    const controls = this.birimForm.controls;

    var object = Object.keys(controls).filter(p => p != "durumu")
      .filter(p => p != "uyruk_bilgisi_durumu")
      .filter(p => p != "id")
      .filter(p => p != "kayit_turu_durumu")
      .filter(p => p != "logo_url")
      .filter(p => p != "baslangic_tarihi")
      .filter(p => p != "ucret_son_odeme_tarihi")
      .filter(p => p != "egitim_donemi_id")
      .filter(p => p != "dil_bilgisi_durumu")
      .filter(p => p != "vize_bilgisi_durumu")
      .filter(p => p != "basvuru_turu")
      .filter(p => p != "ucret_odeme_turu")
      .filter(p => p != "odeme_bankasi")
      .filter(p => p != "ucret_zamani")
      .filter(p => p != "bitis_tarihi");

    object.forEach(p => {
      this.birimForm.get(p).setValue("deneme");
    })
    return object;
  }

  onSumbit() {
    this.birimBasvuru = this.birimForm.value;
    this.birimBasvuru = this.dataFormat(this.birimBasvuru);
    const _messageType = this.birimBasvuru.id ? MessageType.Update : MessageType.Create;
    this.BirimYonetimService.saveRecourse(this.birimBasvuru).subscribe(res => {

      if (res.result) {
        let saveMessageTranslateParam = this.birimBasvuru.id ? 'UPDATE_SUCCESSFUL' : 'SAVE_SUCCESSFUL';
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');
        this.goBackWithoutId();
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
      }

    });

  }
  dataFormat(birimBasvuru: birimBasvuru) {
    birimBasvuru.baslangic_tarihi = this.datepipe.transform(birimBasvuru.baslangic_tarihi, "dd/MM/yyyy");
    birimBasvuru.bitis_tarihi = this.datepipe.transform(birimBasvuru.bitis_tarihi, "dd/MM/yyyy");
    birimBasvuru.ucret_son_odeme_tarihi = this.datepipe.transform(birimBasvuru.ucret_son_odeme_tarihi, "dd/MM/yyyy")
    return birimBasvuru;
  }

  durumuText: string = 'TEXT.FALSE';
  uyruk_bilgisi: string = 'TEXT.FALSE';
  kayit_turu: string = 'TEXT.FALSE';
  dil_bilgisi: string = 'TEXT.FALSE';
  vize_bilgisi: string = 'TEXT.FALSE';

  //1 durum 
  //2 kayit_turu
  //3 uyruk_bilgisi

  changeStatu(e) {
    if (e == 1) { this.durumuText = this.durumuText == "TEXT.FALSE" ? 'TEXT.TRUE' : 'TEXT.FALSE'; }
    if (e == 2) { this.kayit_turu = this.kayit_turu == "TEXT.FALSE" ? 'TEXT.TRUE' : 'TEXT.FALSE'; }
    if (e == 3) { this.uyruk_bilgisi = this.uyruk_bilgisi == "TEXT.FALSE" ? 'TEXT.TRUE' : 'TEXT.FALSE'; }
    if (e == 4) { this.dil_bilgisi = this.dil_bilgisi == "TEXT.FALSE" ? 'TEXT.TRUE' : 'TEXT.FALSE'; }
    if (e == 3) { this.vize_bilgisi = this.vize_bilgisi == "TEXT.FALSE" ? 'TEXT.TRUE' : 'TEXT.FALSE'; }
  }

  goBack(id) {
    const url = `/ecommerce/products?id=${id}`;
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }

  goBackWithoutId() {
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

  getComponentTitle() {
    let result = 'Create Unit';
    //if (!this.product || !this.product.id) {
    return result;
    //	}
    //	result = `Edit product - ${this.product.manufacture} ${this.product.model}, ${this.product.modelYear}`;
  }

  isContorlMessage(saveMessageTranslateParam: string, name) {
    //this.authNoticeService.setNotice(this.translate.instant('VALIDATION.NOT_FOUND', {name: this.translate.instant('TEXT.eposta')}), 'danger');
    console.log(' bankaValid:', this.translate.instant(saveMessageTranslateParam, { name: name }));
    return this.translate.instant(saveMessageTranslateParam, { name: name });
  }
  /**
 * Checking control validation
 *
 * @param controlName: string => Equals to formControlName
 * @param validationType: string => Equals to valitors name
 */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.birimForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
