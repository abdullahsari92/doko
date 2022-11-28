import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { keyValue } from '../../../../../core/models/keyValue';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { birimBasvuru } from '../../../../models/birimBasvuru';
import { BankaTanimService } from '../../../../services/banka-tanim.service';
import { BasvuruService } from '../../../../services/basvuru.service';
import { map } from 'rxjs/operators';
import { SinavBasvuru } from '../../../../models/sinavBasvuru';
import { BirimYonetimService } from '../../../../services/birim_yonetim.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { EgitimDonemi } from '../../../../../views/models/egitimDonemi';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BasvuruSubjectService } from '../../../../../views/services/basvuru-subject.service';
import { UcretOdemeTuru, UcretOdemeZamani } from '../../../../../core/Enums/ucret-odeme.enum';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';

@Component({
  selector: 'kt-sinav-basvuru-add',
  templateUrl: './sinav-basvuru-add.component.html',
  styleUrls: ['./sinav-basvuru-add.component.scss']
})
export class SinavBasvuruAddComponent implements OnInit {
  
  name = 'Angular 6';
  public config = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],

  };

  public Editor = ClassicEditor;
  public watchdog: any;
  public ready = false;
  //editor end

  sinavId: any;
  sinavForm: FormGroup;
  hasFormErrors = false;
  loading = false;
  egitimDonemleri: keyValue[] = [];

  sinavBasvuru: SinavBasvuru = new SinavBasvuru();
  buttonSave: string = this.translate.instant("TEXT.SAVE");
  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private basvuruService: BasvuruService,
    private BirimYonetimService: BirimYonetimService,
    private localStorageService: LocalStorageService,
    public datepipe: DatePipe,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    private bankaService: BankaTanimService,
    private basvuruSubjectService: BasvuruSubjectService,
    private dokoSettingsService: DokoSettingsService
  ) {

    // console.log(' this.router.getCurrentNavigation().extras.state;',this.router.getCurrentNavigation().extras.state)
    //  this.sinavBasvuru = this.router.getCurrentNavigation().extras.state as SinavBasvuru ;

  }

  basvuruTurleri = [
    { value: 1, key: "Sinav" },
    { value: 2, key: "Lisans" },
    { value: 3, key: "Yüksek Lisans" },
    { value: 4, key: "Doktora" },
  ];

  ucretOdemeTuru = UcretOdemeTuru;
  ucretOdemeTurleri = this.dokoSettingsService.getSelectBoxByEnumType(UcretOdemeTuru);

  ucretOdemeZamani = this.dokoSettingsService.getSelectBoxByEnumType(UcretOdemeZamani);
  ngOnInit(): void {

    this.initRegisterForm();
  }

  public getEditor() {
    // Warning: This may return "undefined" if the editor is hidden behind the `*ngIf` directive or
    // if the editor is not fully initialised yet.
    //return this.editorComponent.editorInstance;
  }

  getSinav() {
    this.basvuruSubjectService.currentSinav.subscribe(sinav => {
      this.sinavBasvuru = sinav;
    })
  }

  initRegisterForm() {
    this.getSinav();
    this.getEgitimDonemi();
    this.getBankaTanimlari();
    this.sinavForm = this.fb.group({
      adi_tr: ["", Validators.compose([Validators.required])],
      adi_en: ["", Validators.compose([Validators.required])],
      baslangic_tarihi: ["", Validators.compose([Validators.required])],
      bitis_tarihi: ["", Validators.compose([Validators.required])],
      ucret_odeme_turu: [0, Validators.compose([Validators.required])],
      ucret: [null, Validators.compose([Validators.maxLength(10)])],
      ucret_aciklama_tr: [null, Validators.compose([Validators.maxLength(200)])],
      ucret_aciklama_en: [null, Validators.compose([Validators.maxLength(200)])],
      ucret_zamani: [null],
      odeme_bankasi: [null],
      ucret_son_odeme_tarihi: [null],
      egitim_donemi_id: [0, Validators.compose([Validators.required])],
      kayit_turu_durumu: [0],
      sirasi: ["", Validators.compose([Validators.required,Validators.maxLength(3)])],
      durumu: [false, Validators.compose([Validators.required])],
      kullanim_kosulu_metni_tr: ["", Validators.compose([Validators.required])],
      kullanim_kosulu_metni_en: ["", Validators.compose([Validators.required])],
      //sinav_belgesi_aciklama_tr: ["", Validators.compose([Validators.required])],
      //sinav_belgesi_aciklama_en: ["", Validators.compose([Validators.required])],
      soru_sayisi: [""],
      sinav_tarihi: [""],
      sinav_suresi: [""],
    });

    if (this.sinavBasvuru) {
      this.buttonSave = this.sinavBasvuru.id ? this.translate.instant('TEXT.UPDATE') : this.translate.instant('TEXT.SAVE');
      this.sinavForm.addControl("id", new FormControl());
      const controls = this.sinavForm.controls;
      Object.keys(controls).forEach(controlName => {
        controls[controlName].setValue(this.sinavBasvuru[controlName])
      });

      if(this.sinavBasvuru.ucret_son_odeme_tarihi.valueOf !== null){
        controls["ucret_son_odeme_tarihi"].setValue(new Date(this.sinavBasvuru.ucret_son_odeme_tarihi));
      }
      controls["baslangic_tarihi"].setValue(new Date(this.sinavBasvuru.baslangic_tarihi));
      controls["bitis_tarihi"].setValue(new Date(this.sinavBasvuru.bitis_tarihi));
      controls["sinav_tarihi"].setValue(new Date(this.sinavBasvuru.sinav_tarihi));

      this.durumuText = this.sinavBasvuru.durumu ? this.translate.instant('TEXT.ACTIVE') : this.translate.instant('TEXT.PASSIVE');
      this.kayit_turu = this.sinavBasvuru.kayit_turu_durumu ? this.translate.instant('TEXT.TRUE') : this.translate.instant('TEXT.FALSE');

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
    const controls = this.sinavForm.controls;
    return Object.keys(controls);
  }

  onSumbit() {

    this.sinavBasvuru = this.sinavForm.value;
    this.sinavBasvuru = this.dataFormat(this.sinavBasvuru);
    //  return;
    const _messageType = this.sinavBasvuru.id ? MessageType.Update : MessageType.Create;

    var egitimDonemi = this.localStorageService.getItem("egitimDonemi") as EgitimDonemi;

    this.sinavBasvuru.egitim_donemi_id = egitimDonemi.id;

    this.basvuruService.getSinavSave(this.sinavBasvuru).subscribe(res => {

      if (res.result) {
        let saveMessageTranslateParam = this.sinavBasvuru.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");

        const _saveMessage = this.translate.instant(saveMessageTranslateParam);

        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');

        this.goBackWithoutId();
      }
      else {
        let errorMessageTranslateParam = this.translate.instant("TEXT.ERROR");

        const _errorMessage = this.translate.instant(errorMessageTranslateParam);
        this.layoutUtilsService.showActionNotification(_errorMessage, _messageType, 3000, false, false, null, 'top');
      }

    });

  }

  dataFormat(sinavBasvuru: SinavBasvuru) {
    sinavBasvuru.baslangic_tarihi = this.datepipe.transform(sinavBasvuru.baslangic_tarihi, "dd/MM/yyyy 00:00:00");
    sinavBasvuru.bitis_tarihi = this.datepipe.transform(sinavBasvuru.bitis_tarihi, "dd/MM/yyyy 00:00:00");
    if(sinavBasvuru.ucret_son_odeme_tarihi && sinavBasvuru.ucret_son_odeme_tarihi !== null){
      sinavBasvuru.ucret_son_odeme_tarihi = this.datepipe.transform(sinavBasvuru.ucret_son_odeme_tarihi, "dd/MM/yyyy");
    }
    sinavBasvuru.sinav_tarihi = this.datepipe.transform(sinavBasvuru.sinav_tarihi, "dd/MM/yyyy 00:00:00")
    return sinavBasvuru;
  }

  durumuText: string = this.translate.instant("TEXT.PASSIVE");
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
      this.vize_bilgisi = this.vize_bilgisi == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");
    }
    if (e == 4) {
      this.dil_bilgisi = this.dil_bilgisi == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");
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
    //this.authNoticeService.setNotice(this.translate.instant('VALIDATION.NOT_FOUND', {name: this.translate.instant('TEXT.eposta')}), 'danger');
    //console.log(' bankaValid:',this.translate.instant(saveMessageTranslateParam, {name: name}));
    return this.translate.instant(saveMessageTranslateParam, { name: name });
  }
  /**
 * Checking control validation
 *
 * @param controlName: string => Equals to formControlName
 * @param validationType: string => Equals to valitors name
 */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.sinavForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  // submit() {

  //   const controls = this.sinavForm.controls;
  //   if (this.sinavForm.invalid) {
  //     Object.keys(controls).forEach(controlName =>
  //       controls[controlName].markAsTouched()
  //     );
  //     return;
  //   }


  // }

}
