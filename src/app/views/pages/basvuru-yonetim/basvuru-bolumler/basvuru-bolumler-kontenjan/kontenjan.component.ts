// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { TranslateService } from '../../../../../core/services/translate.service';
// import { AgGridAngular } from 'ag-grid-angular';
// import { BasvuruService } from '../../../../services/basvuru.service';
// import { MatDialog } from '@angular/material/dialog';
// import { DeleteEntityDialogComponent } from '../../../../partials/content/crud/delete-entity-dialog/delete-entity-dialog.component';
// import { OgrenciModel } from '../../../../models/ogrenciModel';


// @Component({
//   selector: 'kt-basvuru-bolumler-kontenjan',
//   templateUrl: './kontenjan.component.html',
//   styleUrls: ['./kontenjan.component.scss']
// })
// export class KontenjanComponent implements OnInit {

//   addModel:any;
//   agGrid: AgGridAngular;
//   columnDefs: any;
//   rowData: any;
//   basvuruId: any;
//   bolId: any;

//   isEdit:boolean= false;

//   buttonSave: string = this.translate.instant("TEXT.SAVE");

//   constructor(
//     private translate: TranslateService,
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//     private basvuruService: BasvuruService,
//     private dialog: MatDialog,
//     private cdf:ChangeDetectorRef,
    
//   ) {
//     this.basvuruId = this.router.getCurrentNavigation().extras.state.basvuruId;
//     this.bolId = this.router.getCurrentNavigation().extras.state.bolId;

//     // this.addModel.basvuruId=this.basvuruId;
//     // this.addModel.bolId = this.bolId; 

//   }

//   ngOnInit(): void {
//     this.agGridInit();
//     this.getList();
//   }

//   editData(data) { 
    
//     new Promise((resolve, reject) => {

//       this.addModel=data;
//       this.isEdit = true;
    
// 		setTimeout(() => {
// 			resolve(true);
// 		}, 500);
//     }).then(()=>{

//     this.cdf.markForCheck();
      
//     })

//   }

//   remove(bolId) {
//     var description = this.translate.instant('TEXT.DELETE_WANT');
//     var waitDesciption = this.translate.instant('TEXT.DELETE_SUCCESSFUL');

//     const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
//       width: '440px'
//     });

//     dialogRef.afterClosed().subscribe(refData => {
//       this.agGrid.api.deselectAll();
//       if (!refData) {
//         //burada modal kapanıyor
//         return;
//       }

//       this.basvuruService.getBolumKontenjanDelete(bolId).subscribe(res => {

//         if (res.result) {
//           this.getList();
//         }
//       });

//     });

//   }

//   getList() {
//     this.basvuruService.getBolumKontenjanList(this.basvuruId, this.bolId).subscribe(res => {

//       if (res.result) {
//         this.rowData = res.data;
//       }
//     })
//   }

//   agGridSet(agGrid) {
//     this.agGrid = agGrid;
//   }

//   agGridInit() {
//     this.columnDefs = [
//       { field: 'id', headerName: this.translate.instant("TEXT.id"), sortable: true, filter: true, hide: true },
//       { field: 'ulke_kodu', headerName: this.translate.instant("TEXT.ulke_kodu"), minWidth: 175 },
//       { field: 'ulke_adi', headerName: this.translate.instant("TEXT.ulke_adi"), minWidth: 175 },
//       { field: 'kontenjan', headerName: this.translate.instant("TEXT.kontenjan"), minWidth: 175 },
//       { field: 'min_kontenjan', headerName: this.translate.instant("TEXT.min_kontenjan"), minWidth: 175 },
//       { field: 'durumu', headerName: this.translate.instant("TEXT.durumu"), minWidth: 175 },
//       { field: 'id', headerName: this.translate.instant("TEXT.SETTINGS"), minWidth: 175, cellRenderer: 'agGridActionComponent', },

//     ];

//   }

//   goBackWithoutId() {
//     this.router.navigate(['../'+this.basvuruId], { relativeTo: this.activatedRoute });
//   }


// }
