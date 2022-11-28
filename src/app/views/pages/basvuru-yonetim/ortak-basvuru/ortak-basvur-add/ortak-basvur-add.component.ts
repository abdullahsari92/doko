import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { keyValue } from '../../../../../core/models/keyValue';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { birimBasvuru } from '../../../../models/birimBasvuru';
import { BankaTanimService } from '../../../../services/banka-tanim.service';
import { BasvuruService } from '../../../../services/basvuru.service';
import { map } from 'rxjs/operators';
import { parseInt } from 'lodash';
import { BirimYonetimService } from '../../../../services/birim_yonetim.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { EgitimDonemi } from '../../../../../views/models/egitimDonemi';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { BasvuruSubjectService } from 'src/app/views/services/basvuru-subject.service';
import { BasvuruSubjectService } from '../../../../../views/services/basvuru-subject.service';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';
import { UcretOdemeTuru, UcretOdemeZamani } from '../../../../../core/Enums/ucret-odeme.enum';

@Component({
  selector: 'kt-ortak-basvur-add',
  templateUrl: './ortak-basvur-add.component.html',
  styleUrls: ['./ortak-basvur-add.component.scss']
})
export class OrtakBasvurAddComponent implements OnInit {

  sinavId: any;
  basvuruForm: FormGroup;
  hasFormErrors = false;
  loading = false;
  egitimDonemleri: keyValue[] = [];
  egitimDonemi: EgitimDonemi;

  @Input() basvuruTuru: any;

  birimBasvuru: birimBasvuru = new birimBasvuru();
  buttonSave: string = this.translate.instant("TEXT.SAVE");
  addTitle: string = this.translate.instant("TITLE.sinav_basvuru_tanim");
  public Editor = ClassicEditor;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private basvuruService: BasvuruService,
    private BirimYonetimService: BirimYonetimService,
    private localStorageService: LocalStorageService,
    public datepipe: DatePipe,
    private layoutUtilsService: LayoutUtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private bankaService: BankaTanimService,
    private basvuruSubjectService: BasvuruSubjectService,
    private dokoSettingsService: DokoSettingsService

  ) { }


  basvuruTurleri = [
    { value: 1, key: "Sinav" },
    { value: 2, key: "Lisans" },
    { value: 3, key: "Yüksek Lisans" },
    { value: 4, key: "Doktora" },
    { value: 5, key: "Giriş Ücreti" },
  ];

  
  ucretOdemeZamani = [
    { value: 0, key: this.translate.instant("TEXT.basvuru_aninda") },
    { value: 1, key: this.translate.instant("TEXT.yerlestirmeden_sonra") }
  ]

  ucretOdemeTuru = UcretOdemeTuru;
  ucretOdemeTurleri = this.dokoSettingsService.getSelectBoxByEnumType(UcretOdemeTuru);
  ngOnInit(): void {
    this.initRegisterForm();

  }

  getBasvuru() {
    this.basvuruSubjectService.currentBirim.subscribe(basvuru => {
      this.birimBasvuru = basvuru;
    });

  }


  initRegisterForm() {

    this.getBasvuru();
    if (this.basvuruTuru == 1) {
      this.addTitle = this.translate.instant("TITLE.sinav_basvuru_tanim");
    } else if (this.basvuruTuru == 2) {
      this.addTitle = this.translate.instant("TITLE.lisans_basvuru_tanim");
    } else if (this.basvuruTuru == 3) {
      this.addTitle = this.translate.instant("TITLE.yuksek_lisans_basvuru_tanim");
    } else if (this.basvuruTuru == 4) {
      this.addTitle = this.translate.instant("TITLE.doktora_basvuru_tanim");
    }else if (this.basvuruTuru == 5) {
      this.addTitle = this.translate.instant("TITLE.giris_ucreti_basvuru_tanim");
    }

    this.getEgitimDonemi();
    this.getBankaTanimlari();
    this.basvuruForm = this.fb.group({

      adi_tr: ["", Validators.compose([Validators.required])],
      adi_en: ["", Validators.compose([Validators.required])],
      baslangic_tarihi: ["", Validators.compose([Validators.required])],
      bitis_tarihi: ["", Validators.compose([Validators.required])],
      ucret_odeme_turu: [0, Validators.compose([Validators.required])],
      ucret: [null, Validators.compose([Validators.maxLength(10)])],
      ucret_zamani: [null],
      ucret_aciklama_tr: [null, Validators.compose([Validators.maxLength(200)])],
      ucret_aciklama_en: [null, Validators.compose([Validators.maxLength(200)])],
      odeme_bankasi: [null],
      ucret_son_odeme_tarihi: [null],
      basvuru_turu: [this.basvuruTuru],
      egitim_donemi_id: [0],
      dil_bilgisi_durumu: [0],
      vize_bilgisi_durumu: [0],
      durumu: [0],
      kullanim_kosulu_metni_tr: ["", Validators.compose([Validators.required])],
      kullanim_kosulu_metni_en: ["", Validators.compose([Validators.required])],
      uyruk_bilgisi_durumu: [0],
      kayit_turu_durumu: [0],
      sirasi: ["", Validators.compose([Validators.required,Validators.maxLength(3)])],

    });

    if (this.birimBasvuru) {
      this.buttonSave = this.birimBasvuru.id ? this.translate.instant('TEXT.UPDATE') : this.translate.instant('TEXT.SAVE');
      console.log(' birimBasvuru', this.birimBasvuru)

      this.basvuruForm.addControl("id", new FormControl());

      const controls = this.basvuruForm.controls;

      Object.keys(controls).forEach(controlName => {

        controls[controlName].setValue(this.birimBasvuru[controlName])

      });

      if(this.birimBasvuru.ucret_son_odeme_tarihi.valueOf != null){
        controls["ucret_son_odeme_tarihi"].setValue(new Date(this.birimBasvuru.ucret_son_odeme_tarihi));
      }
      controls["baslangic_tarihi"].setValue(new Date(this.birimBasvuru.baslangic_tarihi));
      controls["bitis_tarihi"].setValue(new Date(this.birimBasvuru.bitis_tarihi));

      this.durumuText = this.birimBasvuru.durumu ? this.translate.instant('TEXT.ACTIVE') : this.translate.instant('TEXT.PASSIVE');
      this.kayit_turu = this.birimBasvuru.kayit_turu_durumu ? this.translate.instant('TEXT.TRUE') : this.translate.instant('TEXT.FALSE');
      this.uyruk_bilgisi = this.birimBasvuru.uyruk_bilgisi_durumu ? this.translate.instant('TEXT.TRUE') : this.translate.instant('TEXT.FALSE');

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
        var banka = { key: this.translate.instant("TEXT.SELECT"), value: "-1", selected: false }
        this.bankaList.push(banka)
        res.data.forEach(m => {
          var banka = { key: m.adi, value: m.id, selected: false }
          this.bankaList.push(banka)
        });
      }
    })
  }

  ObjectContorlsDeneme() {
    const controls = this.basvuruForm.controls;
    return Object.keys(controls);
  }

  onSumbit() {

    const controls = this.basvuruForm.controls;
    if (this.basvuruForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

    console.log('onSumbit ',this.basvuruForm)
      return;
    }

    this.birimBasvuru = this.basvuruForm.value;

    this.birimBasvuru = this.dataFormat(this.birimBasvuru);
    const _messageType = this.birimBasvuru.id ? MessageType.Update : MessageType.Create;
    this.egitimDonemi = this.localStorageService.getItem('egitimDonemi') as EgitimDonemi;
    this.birimBasvuru.egitim_donemi_id = this.egitimDonemi.id;
    this.birimBasvuru.basvuru_turu = this.basvuruTuru;
    this.basvuruService.getSaveOrtakBasvuru(this.birimBasvuru).subscribe(res => {

      if (res.result) {
        let saveMessageTranslateParam = this.birimBasvuru.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");
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
    if(birimBasvuru.ucret_son_odeme_tarihi && birimBasvuru.ucret_son_odeme_tarihi !== null){
      birimBasvuru.ucret_son_odeme_tarihi = this.datepipe.transform(birimBasvuru.ucret_son_odeme_tarihi, "dd/MM/yyyy");
    }
    return birimBasvuru;
  }

  durumuText: string = this.translate.instant("TEXT.PASSIVE");
  uyruk_bilgisi: string = this.translate.instant("TEXT.FALSE");
  kayit_turu: string = this.translate.instant("TEXT.FALSE");
  dil_bilgisi: string = this.translate.instant("TEXT.FALSE");
  vize_bilgisi: string = this.translate.instant("TEXT.FALSE");

  changeStatu(e) {
    if (e == 1) {
      this.durumuText = this.durumuText == this.translate.instant("TEXT.PASSIVE") ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
    }
    if (e == 2) {
      this.kayit_turu = this.kayit_turu == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");
    }
    if (e == 3) {
      this.uyruk_bilgisi = this.uyruk_bilgisi == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");
    }
    if (e == 4) {
      this.dil_bilgisi = this.dil_bilgisi == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");
    }
    if (e == 5) {
      this.vize_bilgisi = this.vize_bilgisi == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");
    }
  }

  goBack(id) {
    const url = `/ecommerce/products?id=${id}`;
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }

  goBackWithoutId() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  // getComponentTitle() {

  //   let result = 'Create Unit';
  //   return result;
  // }

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
    const control = this.basvuruForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  submit() {

    const controls = this.basvuruForm.controls;
    if (this.basvuruForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

  }


}
