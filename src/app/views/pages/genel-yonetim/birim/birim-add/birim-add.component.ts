import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { BirimModel } from '../../../../models/birimModel';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { BirimService } from '../../../../services/birim.service';
import { BirimBasvuruModulleri } from '../../../../../core/Enums/BirimBasvuruModulleri.enum';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'kt-birim-add',
  templateUrl: './birim-add.component.html',
  styleUrls: ['./birim-add.component.scss']
})
export class BirimAddComponent implements OnInit {

  editorConfig: AngularEditorConfig = {
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
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
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
    uploadUrl: 'v1/image',
    // upload: (file: File) => { ... },
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  public Editor = ClassicEditor;


  birimModel: BirimModel = new BirimModel();
  birimForm: FormGroup;
  hasFormErrors = false;
  loading = false;
  birimBasvuruModulForm: FormGroup;

  dilKodlari = [
    { value: 'tr', key: this.translate.instant("LANGUAGE.tr") },
    { value: 'en', key: this.translate.instant("LANGUAGE.en") },
    { value: 'ch', key: this.translate.instant("LANGUAGE.ch") },
    { value: 'sp', key: this.translate.instant("LANGUAGE.sp") },
    { value: 'ge', key: this.translate.instant("LANGUAGE.ge") },
    { value: 'ja', key: this.translate.instant("LANGUAGE.ja") },
    { value: 'fr', key: this.translate.instant("LANGUAGE.fr") },
  ];



  buttonSave: string = this.translate.instant('TEXT.SAVE');
  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private birimService: BirimService,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    private dokoSettingsService: DokoSettingsService

  ) {

    this.birimModel = this.router.getCurrentNavigation().extras.state as BirimModel;

  }

  BirimBasvuruModulleri = BirimBasvuruModulleri;
  BirimBasvuruModul = this.dokoSettingsService.getSelectBoxByEnumType(BirimBasvuruModulleri);


  ngOnInit(): void {

    this.initRegisterForm();
  }

  public getEditor() {
    // Warning: This may return "undefined" if the editor is hidden behind the `*ngIf` directive or
    // if the editor is not fully initialised yet.
    //return this.editorComponent.editorInstance;
  }

  imgUrl: string = "";
  default_dil: string = "";

  initRegisterForm() {

    this.birimForm = this.fb.group({
      adi_tr: ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      adi_en: ["", Validators.compose([Validators.maxLength(100)])],
      kisa_adi: ["", Validators.compose([Validators.maxLength(50)])],
      url: ["", Validators.compose([Validators.maxLength(100)])],
      telefon: ["", Validators.compose([Validators.maxLength(500)])],
      adres_tr: ["", Validators.compose([Validators.required])],
      adres_en: ["", Validators.compose([Validators.required])],
      kvkk_metni_url_tr: [""],
      kvkk_metni_url_en: [""],
      acik_riza_beyani_tr: [""],
      acik_riza_beyani_en: [""],
      default_dil: ["", Validators.compose([Validators.required, Validators.maxLength(2)])],
      uyruk_bilgisi_durumu: [0],
      kayit_turu_durumu: [0],
      durumu: [true],
      birim_basvuru_modulleri: [""],
      logo_url: ['', Validators.compose([Validators.required])],	//burası resim base 64 gidecek sonra
    });

    this.birimBasvuruModulForm = this.fb.group({});
    this.BirimBasvuruModul.forEach(m => {
      //this.birimBasvuruModulForm.addControl(id, new FormControl({ value: m.key }));
      this.birimBasvuruModulForm.addControl(m.value, new FormControl());
    });

    if (this.birimModel) {

      console.log(' birimModel', this.birimModel)
      this.birimForm.addControl("id", new FormControl());

      const controls = this.birimForm.controls;
      Object.keys(controls).forEach(controlName => {
        controls[controlName].setValue(this.birimModel[controlName])
      });
      this.durumuText = this.birimModel.durumu ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
      this.kayit_turu = this.birimModel.kayit_turu_durumu ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");
      this.uyruk_bilgisi = this.birimModel.uyruk_bilgisi_durumu ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE");


      const Parametre = JSON.parse(this.birimModel.birim_basvuru_modulleri);
      this.BirimBasvuruModul.forEach(m => {
        this.birimBasvuruModulForm.setControl(m.value, new FormControl(Parametre[m.value]));
      });


    }
    this.imgUrl = this.birimModel.logo_url;
    this.default_dil = this.birimModel.default_dil;

  }

  ObjectContorls() {
    const controls = this.birimForm.controls;
    return Object.keys(controls);
  }

  ifTextBox(item): boolean {
    if (item == "logo_url" || item == "uyruk_bilgisi_durumu" || item == "kayit_turu_durumu" || item == "durumu" || item == "id" || item == "default_dil" || item == "birim_basvuru_modulleri") {
      return false;
    }
    else {
      //	this.birimForm.get(item).setValue("te");
      return true;
    }

  }

  // birimBasvuruModulFormContorls() {
  // 	const controls = this.birimBasvuruModulForm.controls;
  // 	return Object.keys(controls);
  // }

  birimBasvuruModulFormContorls() {
    const controls = this.birimBasvuruModulForm.controls;
    return Object.keys(controls);
  }

  onSumbit() {

    this.birimModel = this.birimForm.value;
    const _messageType = this.birimModel.id ? MessageType.Update : MessageType.Create;
    var moduljson = JSON.stringify(this.birimBasvuruModulForm.value);
    this.birimModel.birim_basvuru_modulleri = moduljson;
    this.birimService.saveUnit(this.birimModel).subscribe(res => {
      if (res.result) {
        let saveMessageTranslateParam = this.birimModel.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");
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
  uyruk_bilgisi: string = this.translate.instant("TEXT.FALSE");
  kayit_turu: string = this.translate.instant("TEXT.FALSE");

  //1 durum 
  //2 kayit_turu
  //3 uyruk_bilgisi

  changeStatu(e) {
    if (e == 1) { this.durumuText = this.durumuText == this.translate.instant("TEXT.PASSIVE") ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.TEXT.PASSIVE"); }
    if (e == 2) { this.kayit_turu = this.kayit_turu == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE"); }
    if (e == 3) { this.uyruk_bilgisi = this.uyruk_bilgisi == this.translate.instant("TEXT.FALSE") ? this.translate.instant("TEXT.TRUE") : this.translate.instant("TEXT.FALSE"); }
  }

  goBack(id) {
    const url = `/ecommerce/products?id=${id}`;
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }

  goBackWithoutId() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  getComponentTitle() {
    let result = this.translate.instant("TITLE.birim_tanim");
    return result;
  }

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
    const control = this.birimForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
