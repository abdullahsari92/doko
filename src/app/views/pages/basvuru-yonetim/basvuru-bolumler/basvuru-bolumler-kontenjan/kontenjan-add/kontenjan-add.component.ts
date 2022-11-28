// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
// import { TranslateService } from '../../../../../../core/services/translate.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import { keyValue } from '../../../../../../core/models/keyValue';
// import { UlkeTanimService } from '../../../../../services/ulke-tanim.service';
// import { LayoutUtilsService, MessageType } from '../../../../../../core/_base/crud';
// import { BasvuruService } from '../../../../../services/basvuru.service';
// import { KontenjanComponent } from '../kontenjan.component';
// import { finalize, takeUntil, tap } from 'rxjs/operators';
// import { Observable, Subject } from 'rxjs';
// import { analyzeAndValidateNgModules } from '@angular/compiler';
// import { BirimAddComponent } from '../../../../genel-yonetim/birim/birim-add/birim-add.component';
// import { BasvuruBolumlerComponent } from '../../basvuru-bolumler.component';

// @Component({
//   selector: 'kt-basvuru-bolumler-kontenjan-add',
//   templateUrl: './kontenjan-add.component.html',
//   styleUrls: ['./kontenjan-add.component.scss'],
//   //changeDetection: ChangeDetectionStrategy.Default

// })
// export class KontenjanAddComponent implements OnInit {
//   uyrukTipleri = [
//     { value: 0, text: this.translate.instant('TEXT.genel') },
//     { value: 1, text: '1. ' + this.translate.instant('TEXT.uyruk') },
//     { value: 2, text: '2. ' + this.translate.instant('TEXT.uyruk') },
//   ];

//   bolumKontenjanForm: FormGroup;
//   basvuruId: any;
//   bolId: any;

//   hasFormErrors = false;
//   loading = false;
//   buttonSave: string = this.translate.instant("TEXT.SAVE");
//   private unsubscribe: Subject<any>;

//   @Input() addModel: any;

//   constructor(
//     private fb: FormBuilder,
//     private translate: TranslateService,
//     private router: Router,
//     private ulkeService: UlkeTanimService,
//     private layoutUtilsService: LayoutUtilsService,
//     private basvuruService: BasvuruService,
//     private activatedRoute: ActivatedRoute,
//     private KontenjanComponent: KontenjanComponent,
//     private cdr: ChangeDetectorRef

//   ) {
//     this.basvuruId = this.router.getCurrentNavigation().extras.state.basvuruId;
//     this.bolId = this.router.getCurrentNavigation().extras.state.bolId;
//     console.log('this.bolId ...', this.bolId);
//     console.log('this.bolId .....w', this.bolId.id);
//     this.unsubscribe = new Subject();
//   }

//   ngOnInit(): void {
//     this.initRegisterForm();
//   }

//   ngOnChanges(): void {
//     this.initRegisterForm();
//     console.log(' ngOnChanges - add', this.addModel)
//   }

//   initRegisterForm() {

//     this.getUlkeler();
//     this.bolumKontenjanForm = this.fb.group({

//       ulke_kodu: ["", Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(2)])],
//       uyruk_tipi: ['', Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(2)])],
//       kontenjan: ['', Validators.compose([Validators.required, Validators.maxLength(4)])],
//       min_kontenjan: ['', Validators.compose([Validators.required, Validators.maxLength(4)])],
//       durumu: [true],
//     });

//     if (this.addModel) {
//       this.bolumKontenjanForm.addControl("id", new FormControl());
//       const controls = this.bolumKontenjanForm.controls;
//       Object.keys(controls).forEach(controlName => {
//         controls[controlName].setValue(this.addModel[controlName])
//       });

//       this.durumuText = this.addModel.durumu ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
//     }
//   }

//   durumuText: string = this.translate.instant("TEXT.ACTIVE");
//   //1 durum 

//   changeStatu() {
//     this.durumuText = this.durumuText == this.translate.instant("TEXT.PASSIVE") ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");
//   }

//   ulkeKodlari: keyValue[] = []
//   getUlkeler() {

//     if (this.ulkeKodlari.length == 0) {
//       this.ulkeService.getList().subscribe(res => {

//         this.ulkeKodlari = [];
//         if (res.result) {
//           res.data.forEach(element => {
//             var ulke = new keyValue();
//             ulke.key = element.adi_tr;
//             ulke.value = element.kodu;
//             this.ulkeKodlari.push(ulke);

//           });
//         }

//       })
//     }

//   }

//   onSumbit() {

//     var data = this.bolumKontenjanForm.value;

//     const _messageType = data.id ? MessageType.Update : MessageType.Create;

//     this.basvuruService.getBolumKontenjanSave(data, this.bolId, this.basvuruId).pipe(tap(res => {
//       if (res.result) {
//         console.log(11);

//         let saveMessageTranslateParam = data.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");
//         const _saveMessage = this.translate.instant(saveMessageTranslateParam);

//         this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');

//         this.KontenjanComponent.getList();
//       }
//       else {
//         this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
//       }

//     }), takeUntil(this.unsubscribe),
//       finalize(() => {

//         this.loading = false;
//         this.cdr.markForCheck();
//         // Main page
//         //this.router.navigateByUrl("admin/dashboard");
//         //	this.router.navigate(['menu/list'], { relativeTo: this.activatedRoute });

//       })).subscribe(p => { }, err => {
//         console.log('loginEERRRO ', err);
//       })

//   }

//   goBackWithoutId() {
//     this.router.navigate(['../'], { state: this.basvuruId, relativeTo: this.activatedRoute });
//   }

//   isContorlMessage(saveMessageTranslateParam: string, name) {
//     return this.translate.instant(saveMessageTranslateParam, { name: name });
//   }
//   /**
//  *
//  * @param controlName: string => Equals to formControlName
//  * @param validationType: string => Equals to valitors name
//  */
//   isControlHasError(controlName: string, validationType: string): boolean {
//     const control = this.bolumKontenjanForm.controls[controlName];
//     if (!control) {
//       return false;
//     }
//     const result = control.hasError(validationType) && (control.dirty || control.touched);
//     return result;
//   }

// }
