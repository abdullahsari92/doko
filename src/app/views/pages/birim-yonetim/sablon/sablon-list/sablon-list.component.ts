import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AgGridAngular } from 'ag-grid-angular';
import { BirimService } from '../../../../../views/services/birim.service';
import { ReportService } from '../../../../../views/services/report.service';
import { SablonAddComponent } from '../sablon-add/sablon-add.component';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { SablonPreviewComponent } from '../sablon-preview/sablon-preview.component';
import { SablonEditComponent } from '../sablon-edit/sablon-edit.component';
import { DeleteEntityDialogComponent } from '../../../../../views/partials/content/crud';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
	name: string;
	key: string;
	children?: FoodNode[];

}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
	expandable: boolean;
	name: string;
	level: number;
}

/**
 * @title Tree with flat nodes
 */
@Component({
	selector: 'kt-sablon-list',
	templateUrl: './sablon-list.component.html',
	styleUrls: ['./sablon-list.component.scss']
})
export class SablonListComponent implements OnInit {

	private _transformer = (node: FoodNode, level: number) => {
		return {
			expandable: !!node.children && node.children.length > 0,
			name: node.name,
			key: node.key,
			level: level,
		};
	};

	treeControl = new FlatTreeControl<ExampleFlatNode>(
		node => node.level,
		node => node.expandable,
	);

	treeFlattener = new MatTreeFlattener(
		this._transformer,
		node => node.level,
		node => node.expandable,
		node => node.children,
	);

	dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

	loader: boolean = true;
	basvuruId: number;
	activeClass: string = "current";
	rowData: any;
	agGrid: AgGridAngular;
	treedata: any;
	TREE_DATA: any;
	sablonKategoriId: any;

	@ViewChild('wizard', { static: true }) el: ElementRef;

	submitted = false;
	//kategoriler:[];

	constructor(
		private BirimService: BirimService,
		private ReportService: ReportService,
		private cdr: ChangeDetectorRef,
		private dialog: MatDialog,
		private activatRoute: ActivatedRoute,
		private translate: TranslateService,
		private router: Router,
		private localStorageService: LocalStorageService,
		private layoutUtilsService: LayoutUtilsService,


	) {
		this.TREE_DATA = this.getKategoriler();
	}

	hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


	ngOnInit() {
		// this.getListReportDefaultData();
		//this.report_file22();
	}

	ngAfterViewInit(): void {
		const wizard = new KTWizard(this.el.nativeElement, {
			startStep: 1
		});
		wizard.on('beforeNext', (wizardObj) => {

		});

		wizard.on('change', () => {
			setTimeout(() => {
				KTUtil.scrollTop();
			}, 100);
		});
	}

	// raporData(){
	// 	// this.ReportService.getListReportData(2).subscribe(res => {		

	// 	// 	console.log('result',res);
	// 	// 	//this.cdr.markForCheck();

	// 	// })
	// 	 var result = this.ReportService.getListReportData(1);
	// }

	getKategoriler() {
		this.ReportService.getKategoriData().subscribe(res => {
			this.dataSource.data = res;
			this.treedata = JSON.stringify(res);
		})
	}

	getSablonList: any[] = [];
	getList(key: any) {
		this.sablonKategoriId = key;

		new Promise((resolve, reject) => {
			this.ReportService.getListSablon(key).subscribe(res => {

				console.log('getListSablon ',res.data)
				if (res.result) {
					this.getSablonList = res.data;
				}
			})
			setTimeout(() => {
				resolve(true);
			}, 300);
		}).then(() => {
			this.cdr.markForCheck();
		})
	}

	addModal() {

		//var data = this.sablonKategoriId;
		var data = { sablon_tanimlari_id: this.sablonKategoriId };

		if (data.sablon_tanimlari_id != '0' && data.sablon_tanimlari_id && data.sablon_tanimlari_id != "") {
			const dialogRef = this.dialog.open(SablonAddComponent, { data });
			dialogRef.afterClosed().subscribe(refData => {
				this.localStorageService.removeItem("agGridEdit");
				if (!refData) {
					return;
				}
				this.getList(this.sablonKategoriId);
			});
		} else {
			const _saveMessage = this.translate.instant("TEXT.sablon_kategori_uyari");

			this.layoutUtilsService.showActionNotification(_saveMessage, 1, 3000, false, false, null, 'top');
		}

	}

	getId(sablon_tanimlari_id, id) {

		var data = { sablon_tanimlari_id, id };

		if (sablon_tanimlari_id != '0' && sablon_tanimlari_id && sablon_tanimlari_id != "" && id != '0' && id && id != "") {
			const dialogRef = this.dialog.open(SablonAddComponent, { data });
			dialogRef.afterClosed().subscribe(refData => {
				this.localStorageService.removeItem("agGridEdit");
				if (!refData) {
					return;
				}
			});
		} else {
			const _saveMessage = this.translate.instant("TEXT.sablon_kategori_uyari");

			this.layoutUtilsService.showActionNotification(_saveMessage, 1, 3000, false, false, null, 'top');
		}

	}

	previewModal(sablon_tanimlari_id, id) {

		var data = { sablon_tanimlari_id, id };

		console.log('previewModal', data)
		if (sablon_tanimlari_id != '0' && sablon_tanimlari_id && sablon_tanimlari_id != "" && id != '0' && id && id != "") {
			const dialogRef = this.dialog.open(SablonPreviewComponent, { data });
			dialogRef.afterClosed().subscribe(refData => {
				this.localStorageService.removeItem("agGridEdit");
				if (!refData) {
					return;
				}
			});
		} else {
			const _saveMessage = this.translate.instant("TEXT.sablon_kategori_uyari");

			this.layoutUtilsService.showActionNotification(_saveMessage, 1, 3000, false, false, null, 'top');
		}

	}

	deleteModal(sablon_tanimlari_id, id) {

		var description =this.translate.instant('TEXT.DELETE_WANT');
		var waitDesciption =this.translate.instant('TEXT.DELETE_SUCCESSFUL');
	
		  const dialogRef =  this.dialog.open(DeleteEntityDialogComponent, {
			//  data: { title, description, waitDesciption },
			  width: '440px',
			});  
		
		  dialogRef.afterClosed().subscribe(refData => {
				//this.agGrid.api.deselectAll();
				if (!refData) {
				  //burada modal kapanıyor
				  return;
				}
				  this.ReportService.delete(id).subscribe(res=>{
	
					if(res.result){
						this.getList(sablon_tanimlari_id);
					}
				  });
				// var _deleteMessage= this.translate.instant('TEXT.DELETE_SUCCESSFUL');
				// this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
	
		  
		  });
	}

	editModal(sablon_tanimlari_id, id) {

		var data = { sablon_tanimlari_id, id }

		const dialogRef = this.dialog.open(SablonEditComponent, { data, width: "70%", maxWidth: "600px", minWidth: "330px", maxHeight: "85%" });
		//const dialogRef = this.dialog.open(AddComponent);

		dialogRef.afterClosed().subscribe(refData => {

			//this.localStorageService.removeItem("agGridEdit");

			if (!refData) {
				//burada modal kapanıyor
				return;
			}

			this.updateSablon(refData.data);

		});

	}

	updateSablon(data) {

		const _messageType = data.id ? MessageType.Update : MessageType.Create;

		this.ReportService.getReportUpdate(data).subscribe(res => {

			if (res.result) {
				this.dialog.closeAll();
				let saveMessageTranslateParam = data.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");
				const _saveMessage = this.translate.instant(saveMessageTranslateParam);
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');

				//   this.getList();
				//   this.agGrid.api.refreshCells();
		 	this.getList(this.sablonKategoriId);

			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
			}
		})

	}

	// getListReportDefaultData() {

	// 	this.ReportService.getListReportDefaultData().subscribe(res => {		
	// 	//console.log('getListReportDefaultData ',res)
	// 	})
	// }







}
