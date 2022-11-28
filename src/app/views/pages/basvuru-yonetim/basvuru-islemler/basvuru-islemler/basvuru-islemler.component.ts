
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../../../core/services/translate.service';
import { BasvuruService } from '../../../../services/basvuru.service';
import { keyValue } from '../../../../../core/models/keyValue';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupName } from '@angular/forms';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EgitimDonemi } from '../../../../../views/models/egitimDonemi';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';

@Component({
  selector: 'kt-basvuru-islemler',
  templateUrl: './basvuru-islemler.component.html',
  styleUrls: ['./basvuru-islemler.component.scss']
})
export class BasvuruIslemlerComponent implements OnInit {

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

  hasFormErrors = false;
  basvuruIslemlerForm: FormGroup;
  raporForm: any;
  loading = false;
  basvuruId: any;
  buttonSave: string = this.translate.instant('TEXT.UPDATE');
  egitimDonemi: EgitimDonemi;
  data: any;

  private unsubscribe: Subject<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private basvuruService: BasvuruService,
    private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private localStorageService: LocalStorageService,

  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.basvuruId = params.get("basvuruId");
      this.getSablonTurleri();
      this.getSablonListe();
      this.initRegisterForm();
    })

  }

  public getEditor() {
    // Warning: This may return "undefined" if the editor is hidden behind the `*ngIf` directive or
    // if the editor is not fully initialised yet.
    //return this.editorComponent.editorInstance;
  }

  initRegisterForm() {

    this.basvuruIslemlerForm = this.fb.group({
      sonuc_goster: [false, Validators.compose([Validators.required])],
      raporlar: [""],
      tercih_sayisi: ["", Validators.compose([Validators.required])],
    });

    this.raporForm = this.fb.group({});

    this.basvuruService.getSablonTreeList(2).subscribe(res => {
      res.data.forEach(m => {
        var id: string = m.id;
        this.raporForm.addControl(id, new FormControl());
      });
    })

    if (this.basvuruId) {
      this.basvuruIslemlerForm.addControl("basvuru_id", new FormControl())
      this.basvuruIslemlerForm.get("basvuru_id").setValue(this.basvuruId);
      this.buttonSave = this.translate.instant('TEXT.UPDATE');
      this.basvuruService.getDigerBasvuruBilgi(this.basvuruId).subscribe(res => {

        if (res.result) {
          this.basvuruIslemlerForm.setValue({
            sonuc_goster: res.data.sonuc_goster,
            tercih_sayisi: res.data.tercih_sayisi,
            raporlar: '',
            basvuru_id: this.basvuruId,
          })

          if (res.data.raporlar) {
            const Parametre = JSON.parse(res.data.raporlar);
            this.raporForm.setValue(Parametre);
          }

        }
      })
    }
  }

  onSumbit() {
    const controls = this.basvuruIslemlerForm.controls;
    var raporlarjson = JSON.stringify(this.raporForm.value);
    this.basvuruIslemlerForm.get("raporlar").setValue(raporlarjson);
    var data = this.basvuruIslemlerForm.value;
    //console.log('daata',data);
    const _messageType = MessageType.Update;
    this.basvuruService.getBasvuruDigerİslemlerSave(data).subscribe(res => {
      if (res.result) {
        let saveMessageTranslateParam = this.translate.instant("TEXT.UPDATE_SUCCESSFUL");
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
      }
    })
  }

  SablonTuru: keyValue[] = []
  getSablonTurleri() {
    this.basvuruService.getSablonTreeList(2).subscribe(res => {
      if (res.result) {
        res.data.forEach(element => {
          var item = new keyValue();
          item.key = element.id;
          item.value = element.adi;
          this.SablonTuru.push(item);
        });
      }
    })
  }

  getSablon(id: any): keyValue[] {
    return this.SablonListe.filter(p => p.group == id);
  }

  atama_yap() {
    console.log(this.data.basvuru_turu);

    if (this.data.birimBasvuru.basvuru_turu != '5') {
      this.egitimDonemi = this.localStorageService.getItem('egitimDonemi') as EgitimDonemi;
      this.basvuruService.getAtamaYap(this.basvuruId, this.egitimDonemi.id).subscribe(res => {
      })
    }else{
      console.log('no no2');
      console.log(this.data.basvuru_turu);
    }
  }

  atamayi_geri_al() {
    if (this.data.birimBasvuru.basvuru_turu != '5') {
      this.basvuruService.getAtamayiGeriAl(this.basvuruId).subscribe(res => {
      })
    }else{
      console.log('no no');
    }
  }

  SablonListe: keyValue[] = [];

  getSablonListe() {
    return new Promise((resolve, reject) => {
      this.SablonListe = [];
      this.basvuruService.getSablonlarList().subscribe(res => {
        if (res.result) {
          res.data.forEach(element => {
            var item = new keyValue();
            item.key = element.id;
            item.value = element.adi;
            item.group = element.sablon_tanimlari_id;
            this.SablonListe.push(item);
          });

        } else {
          reject(true);
        }
      })
      setTimeout(() => {
        resolve(true);
      }, 500);
    })
  }

  sonuc_goster: string = this.translate.instant("TEXT.GIZLI");
  //1 sonuçların gösterilme durumu

  changeStatu(e) {
    if (e == 1) {
      this.sonuc_goster = this.sonuc_goster == this.translate.instant("TEXT.GIZLI") ? this.translate.instant("TEXT.goster") : this.translate.instant("TEXT.GIZLI");
    }
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
    const control = this.basvuruIslemlerForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

}
