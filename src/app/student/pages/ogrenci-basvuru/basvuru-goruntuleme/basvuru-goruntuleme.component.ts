import { ThisReceiver, ThrowStmt } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomePageComponent } from '../../home-page/home-page.component';
import { Stimulsoft } from 'stimulsoft-reports-js/Scripts/stimulsoft.blockly';
import { DokoSettingsService } from '../../../../core/services/doko-settings.service';
import { StudentService } from '../../../services/student.service';
import { TranslateService } from '../../../../core/services/translate.service';
import { RaporSablonEnum } from '../../../../core/Enums/RaporSablonEnum';
import { ErrorService } from '../../../services/error.service';
import { BasvuruTurEnum } from '../../../../core/Enums/BasvuruTurEnum';
import { OgrenciBasvuruDurumEnum } from '../../../../core/Enums/OgrenciBasvuruDurum.enum';
import Swal from 'sweetalert2';


@Component({
  selector: 'kt-basvuru-goruntuleme',
  templateUrl: './basvuru-goruntuleme.component.html',
  styleUrls: ['./basvuru-goruntuleme.component.scss']
})
export class BasvuruGoruntulemeComponent implements OnInit {
  //Diziler Başlangıç
  public basvuruVerileri: any;
  //Diziler Bitiş

  //Enum Durumlar Başlangıç
  public raporSablonEnum = RaporSablonEnum;
  public basvuruTurEnum = BasvuruTurEnum;
  public OgrenciBasvuruDurumEnum = OgrenciBasvuruDurumEnum;
  //Enum Durumlar Bitiş

  public sablonId: number;
  public reportId: number;
  report: any;
  pageRange: any;

  constructor(
    public dialogRef: MatDialogRef<HomePageComponent>,
    private dialog: MatDialog,
    private dokoSettingsService: DokoSettingsService,
    private studentService: StudentService,
    private translate: TranslateService,
    private errorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    Stimulsoft.Base.StiLicense.key = this.dokoSettingsService.StimulsoftBaseStiLicensekey;
    this.report = Stimulsoft.Report.StiReport.createNewReport();

    if (this.data.basvuruBilgileri !== undefined) {
      if (this.data.basvuruBilgileri.result) {
        this.basvuruVerileri = this.data.basvuruBilgileri.data;
      }
    } else {
      this.basvuruVerileri = this.data;
    }


    if (this.basvuruVerileri.basvuru_turu == this.basvuruTurEnum.sinav) {
      if (this.basvuruVerileri.ogrenci_basvuru_durumu == OgrenciBasvuruDurumEnum.ogrenci_onayladi) {
        this.getRaporId(this.raporSablonEnum.sinav_basvuru_belgesi);
      } else if (this.basvuruVerileri.ogrenci_basvuru_durumu == OgrenciBasvuruDurumEnum.yonetici_onayladi) {
        this.getRaporId(this.raporSablonEnum.sinav_giris_belgesi);
      }
    }
    
    this.getViewReport().then(() => {
      this.pageRange = new Stimulsoft.Report.StiPagesRange(Stimulsoft.Report.StiRangeType.CurrentPage, "1", "1");
    });
  }
  getRaporId(val: RaporSablonEnum) {
    console.log("val", val);
    Object.keys(this.basvuruVerileri.raporlar).forEach((value) => {

      console.log("value", value);
      if (Number(value) == val && this.basvuruVerileri.raporlar[value]) {
        console.log("val2", val);
        this.sablonId = val;
        this.reportId = this.basvuruVerileri.raporlar[value];
      }
    });

    console.log('this.sablonId', this.sablonId);
    console.log('this.reportId', this.reportId);

  }
  getViewReport() {

    console.log('this.sablonId', this.sablonId);
    console.log('this.reportId', this.reportId);
    return new Promise((resolve, reject) => {
      this.getSwal();
      this.getColumnData().then(() => {
        this.getData().then(() => {
          var options = new Stimulsoft.Viewer.StiViewerOptions();
          var viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);

          options.toolbar.visible = true;

          options.toolbar.showPrintButton = false;
          options.toolbar.showOpenButton = false;
          options.toolbar.showSaveButton = false;
          options.toolbar.showFindButton = false;
          options.toolbar.showAboutButton = false;
          options.toolbar.showBookmarksButton = false;
          options.toolbar.showButtonCaptions = false;
          options.toolbar.showCurrentPageControl = false;
          options.toolbar.showDesignButton = false;
          options.toolbar.showEditorButton = false;
          options.toolbar.showFirstPageButton = false;
          options.toolbar.showFullScreenButton = false;
          options.toolbar.showLastPageButton = false;
          options.toolbar.showNextPageButton = false;
          options.toolbar.showSendEmailButton = false;
          options.toolbar.showViewModeButton = false;
          options.toolbar.showZoomButton = false;
          options.toolbar.showPreviousPageButton = false;
          options.toolbar.showResourcesButton = false;
          options.toolbar.showPinToolbarButton = false;
          options.toolbar.showParametersButton = false;
          options.appearance.fullScreenMode = false;

          viewer.report = this.report;
          viewer.renderHtml("viewerContent");

          setTimeout(() => {
            Swal.close();
            resolve(true);
          }, 1000);
        });
      })
    })
  }

  getSwal() {
    Swal.fire({
      title: this.translate.instant("TEXT.LOADING"),
      timer: 10000,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        console.log('kapandı');
      }
    });
  }

  sablonData: any;
  getColumnData() {
    console.log('rapor', this.data);

    return new Promise((resolve, reject) => {
      this.studentService
        .reportViewerData(this.sablonId, this.basvuruVerileri.basvuru_id)
        .subscribe(res => {
          if (res.result) {
            let data_gelen = res.data.toString();
            this.sablonData = '[{' + data_gelen + '}]';

            let dataSet = new Stimulsoft.System.Data.DataSet("Veri Alanları");
            dataSet.readJson(this.sablonData);

            this.report.dictionary.databases.clear();
            this.report.regData(dataSet.dataSetName, '', dataSet);
            this.report.dictionary.synchronize();

            setTimeout(() => {
              resolve(true);
            }, 1000);
          } else {
            Swal.close();
            Swal.fire({
              text: this.translate.instant("TEXT.OPERATION_FAILED"),
              html: this.errorService.arrayError(res.error.message),
              icon: 'error',
              showConfirmButton: true,
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                this.dialogRef.close();
              }
            });
          }
        }, err => {
          Swal.close();
          Swal.fire({
            title: this.translate.instant("TEXT.OPERATION_FAILED"),
            icon: 'error',
            showConfirmButton: true,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.dialogRef.close();
            }
          });
        });
    })
  }
  getData() {
    return new Promise((resolve, reject) => {
      this.studentService
        .report_file(this.sablonId)
        .subscribe(res => {
          if (res) {
            let url = window.URL.createObjectURL(res);
            this.report.loadFile(url);

            setTimeout(() => {
              resolve(true);
            }, 1000);
          } else {
            Swal.close();
            Swal.fire({
              text: this.translate.instant("TEXT.OPERATION_FAILED"),
              html: this.errorService.arrayError(res.error.message),
              icon: 'error',
              showConfirmButton: true,
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                this.dialogRef.close();
              }
            });
            setTimeout(() => {
              reject();
            }, 1000);
          }
        }, err => {
          Swal.close();
          Swal.fire({
            title: this.translate.instant("TEXT.OPERATION_FAILED"),
            icon: 'error',
            showConfirmButton: true,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.dialogRef.close();
            }
          });
        });
    });
  }
  printReport() {
    this.report.print(this.pageRange);
  }
  pdfReport() {
    let fileName = this.report.reportAlias;
    this.report.exportDocumentAsync(function (pdfData) {
      Stimulsoft.System.StiObject.saveAs(pdfData, fileName + ".pdf", "application/pdf");
    }, Stimulsoft.Report.StiExportFormat.Pdf);
  }
  dialogClose() {
    this.dialogRef.close();
  }
}
