import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../../../core/services/translate.service';
import { BasvuruService } from '../../../../services/basvuru.service';
import { keyValue } from '../../../../../core/models/keyValue';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupName } from '@angular/forms';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-sinav-islemler',
  templateUrl: './sinav-islemler.component.html',
  styleUrls: ['./sinav-islemler.component.scss']
})
export class SinavIslemlerComponent implements OnInit {
  hasFormErrors = false;
  sinavIslemlerForm: FormGroup;
  raporForm: any;
  loading = false;
  basvuruId: any;
  buttonSave: string = this.translate.instant('TEXT.UPDATE');

  private unsubscribe: Subject<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private basvuruService: BasvuruService,
    private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,

  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.basvuruId = params.get("basvuruId");
      this.getSablonTurleri();
      this.getSablonListe();
      this.initRegisterForm();
    })

  }

  initRegisterForm() {

    this.sinavIslemlerForm = this.fb.group({
      sonuclari_goster: [false, Validators.compose([Validators.required])],
      raporlar: [''],
    });

    this.raporForm = this.fb.group({});

    this.basvuruService.getSablonTreeList(1).subscribe(res => {
      res.data.forEach(m => {
        var id: string = m.id;
        this.raporForm.addControl(id, new FormControl());
      });
    })

    if (this.basvuruId) {
      this.sinavIslemlerForm.addControl("basvuru_id", new FormControl())
      this.sinavIslemlerForm.get("basvuru_id").setValue(this.basvuruId);

      this.buttonSave = this.translate.instant('TEXT.UPDATE');

      this.basvuruService.getDigerSinavBilgi(this.basvuruId).subscribe(res => {

        if (res.result) {
          this.sinavIslemlerForm.setValue({
            sonuclari_goster: res.data.sonuclari_goster,
            raporlar: '',
            basvuru_id: this.basvuruId,
          })
          if(res.data.raporlar){
            const Parametre = JSON.parse(res.data.raporlar);
            this.raporForm.setValue(Parametre);
          }
        }
      })

    }

  }


  onSumbit() {

    const controls = this.sinavIslemlerForm.controls;
    var raporlarjson = JSON.stringify(this.raporForm.value);
    this.sinavIslemlerForm.get("raporlar").setValue(raporlarjson);
    var data = this.sinavIslemlerForm.value;
    const _messageType = MessageType.Update;
    this.basvuruService.getSinavDigerİslemlerUpdate(data).subscribe(res => {
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

    this.basvuruService.getSablonTreeList(1).subscribe(res => {
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

  sonuclari_goster: string = this.translate.instant("TEXT.GIZLI");
  //1 sonuçların gösterilme durumu

  changeStatu(e) {
    if (e == 1) {
      this.sonuclari_goster = this.sonuclari_goster == this.translate.instant("TEXT.GIZLI") ? this.translate.instant("TEXT.goster") : this.translate.instant("TEXT.GIZLI");
    }
  }


}
