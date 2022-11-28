import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../core/services/translate.service';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { OgrenciService } from '../../../services/ogrenci.service';
import { keyValue } from '../../../../core/models/keyValue';
import { DokoSettingsService } from '../../../../core/services/doko-settings.service';

@Component({
  selector: 'kt-ogrenci-add',
  templateUrl: './ogrenci-add.component.html',
  styleUrls: ['./ogrenci-add.component.scss']
})
export class OgrenciAddComponent implements OnInit {

  cinsiyetListesi = [
    { value: 'E', key: "Erkek" },
    { value: 'K', key: "Kadın" },
  ];

  ogrenciTanimForm: FormGroup;
  hasFormErrors = false;
  loading = false;
  data: any;
  buttonSave: string = this.translate.instant("TEXT.SAVE");

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private ogrenciService: OgrenciService,
    private layoutUtilsService: LayoutUtilsService,
    public datepipe: DatePipe,
    private router: Router,
    public dokoSettingsService:DokoSettingsService,

  ) {

    this.data = this.router.getCurrentNavigation().extras.state;
    console.log('this.data ff',this.data);

  }

  ngOnInit(): void {

    this.initRegisterForm();
    this.getUlkeler();
  }
  
  // imgUrl: string = "";
  initRegisterForm() {
    this.ogrenciTanimForm = this.fb.group({
      //uid:["", Validators.compose([Validators.required, Validators.maxLength(2)])],
      //aday_no: ["", Validators.compose([Validators.maxLength(12)])],
      adi: ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      soyadi: ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      ulke_kodu: ["", Validators.compose([Validators.required, Validators.maxLength(4)])],//kod liistesinden seç
      //obs_no: ["", Validators.compose([Validators.maxLength(50)])],
      //kurum_id: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      kimlik_no: ["", Validators.compose([Validators.maxLength(25)])],
      pasaport_no: ["", Validators.compose([Validators.maxLength(100)])],
      durumu: [true],
      anne_adi: ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      baba_adi: ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      dogum_yeri: ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      dogum_tarihi: ["", Validators.compose([Validators.required])],
      cinsiyet: ["", Validators.compose([Validators.required])],
      eposta: ["", Validators.compose([Validators.required, Validators.email, Validators.maxLength(150)])],
      sehir: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      adres: ["", Validators.compose([Validators.maxLength(255)])],
      telefon: ["", Validators.compose([Validators.required, Validators.pattern('(05[0-9]{2}\\s)+([0-9]{3}\\s)+([0-9]{2}\\s)+([0-9]{2})'), Validators.maxLength(14)])],
      telefon2: ["", Validators.compose([Validators.required, Validators.maxLength(14)])],
      resim: [0],
      turler: [""],
    });

    if (this.data) {
      console.log('ssdd',this.data);

      this.buttonSave = this.translate.instant('TEXT.UPDATE')
      this.ogrenciTanimForm.addControl("id", new FormControl());
      const controls = this.ogrenciTanimForm.controls;
      Object.keys(controls).forEach(controlName => {
        controls[controlName].setValue(this.data[controlName])
      });
      this.durumuText = this.data.durumu ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");

      controls["dogum_tarihi"].setValue(new Date(this.data.dogum_tarihi));

      if(this.data.kimlik_no)
      {
       controls["turler"].setValue(1);
      }
      if(this.data.pasaport_no)
      {
       controls["turler"].setValue(2);
      }
      console.log('dagum_tarihi',new Date(this.data.dagum_tarihi))
    }
  }

  
  // ObjectContorlsDeneme() {
  //   const controls = this.ogrenciForm.controls;
  //   return Object.keys(controls);
  // }

  ObjectContorls() {
    const controls = this.ogrenciTanimForm.controls;
    var object = Object.keys(controls).filter(p => p != "cinsiyet")
      .filter(p => p != "id")
      .filter(p => p != "ulke_kodu")
      .filter(p => p != "resim")
      .filter(p => p != "durumu")
      .filter(p => p != "turler")
      .filter(p => p != "dogum_tarihi")
      .filter(p => p != "pasaport_no")
      .filter(p => p != "kimlik_no")
      ;
    return object;
  }

  ifTextBox(item): boolean {
    if (item == "cinsiyet" || item == "id" || item == "ulke_kodu" || item == "resim" || item == "dogum_tarihi" || item == "durumu" || item == "turler" || item == "kimlik_no" || item == "pasaport_no") {
      return false;
    }
    else {
      return true;
    }
  }

  ulkeKodlari: keyValue[] = []
  getUlkeler() {
    this.ogrenciService.getCountryList().subscribe(res => {
      if (res.result) {
        res.data.forEach(element => {
          var ulke = new keyValue();
          ulke.key = element.adi_tr;
          ulke.value = element.kodu;
          this.ulkeKodlari.push(ulke);
        });
      }
    })
  }
  
  onSumbit() {

    this.data = this.ogrenciTanimForm.value;
    this.data.dogum_tarihi = this.datepipe.transform(this.data.dogum_tarihi, "dd-MM-yyyy");
    //  return;
    console.log('    onSumbit',    this.data)

    //return;
    const _messageType = this.data.id ? MessageType.Update : MessageType.Create;
    this.ogrenciService.save(this.data).subscribe(res => {
      console.log('resunit save : ', res)
      if (res.result) {
        console.log('11');
        let saveMessageTranslateParam = this.data.id ? 'UPDATE_SUCCESSFUL' : 'SAVE_SUCCESSFUL';
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');

        this.data = res.data;
        this.goBackWithoutId();
      }
      else {
        console.log('22');
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
    this.router.navigate(['../detail'], { relativeTo: this.activatedRoute, state: this.data  });
  }

  getComponentTitle() {
    let result = this.translate.instant("TITLE.ogrenci_tanim");
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
    const control = this.ogrenciTanimForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  // submit() {


  //   console.log('this.yetkiTanimForm.value;', this.ogrenciForm.value)
  //   // this.yetkiTanimForm.value;


  //   const controls = this.ogrenciForm.controls;
  //   /** check form */
  //   if (this.ogrenciForm.invalid) {
  //     Object.keys(controls).forEach(controlName =>
  //       controls[controlName].markAsTouched()
  //     );
  //     return;
  //   }


  // }

}
