import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';
import { SablonListComponent } from '../sablon-list/sablon-list.component';
import { Stimulsoft } from 'stimulsoft-reports-js/Scripts/stimulsoft.blockly'
import { ReportService } from '../../../../../views/services/report.service';

@Component({
  selector: 'kt-sablon-preview',
  templateUrl: './sablon-preview.component.html',
  styleUrls: ['./sablon-preview.component.scss']
})
export class SablonPreviewComponent implements OnInit {

  report: any;

  constructor(
    public dialogRef: MatDialogRef<SablonListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dokoSettingsService: DokoSettingsService,
    private ReportService: ReportService,

  ) { }

  ngOnInit(): void {

    Stimulsoft.Base.StiLicense.key = this.dokoSettingsService.StimulsoftBaseStiLicensekey;
    this.report = Stimulsoft.Report.StiReport.createNewReport();

    this.getViewReport().then(() => {
      var pageRange = new Stimulsoft.Report.StiPagesRange(Stimulsoft.Report.StiRangeType.CurrentPage, "1", "1");
      this.report.print(pageRange);
      //window.print(this.report);
    })

  }

  getViewReport() {

    return new Promise((resolve, reject) => {
      this.getColumnData().then(() => {
        this.getData().then(() => {
          var options = new Stimulsoft.Viewer.StiViewerOptions();
          var viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
          options.toolbar.showPrintButton = false;
          options.toolbar.showOpenButton = false;
          options.toolbar.showSaveButton = false;
          options.toolbar.visible = false;
          //options.appearance.fullScreenMode = true;
          viewer.report = this.report;
          viewer.renderHtml("viewerContent");
          setTimeout(() => {
            resolve(true);
          }, 3100);
        });
      });
    })

  }

  sablonData: any;
  getColumnData() {
    return new Promise((resolve, reject) => {
      this.ReportService.reportViewerData().subscribe(res => {
        console.log(res);
        if (res) {
          var data_gelen = res.data.toString();
          this.sablonData = '[{' + data_gelen + '}]';
          var dataSet = new Stimulsoft.System.Data.DataSet("Veri Alanları");
          dataSet.readJson(this.sablonData);
          this.report.dictionary.databases.clear();
          this.report.regData(dataSet.dataSetName, '', dataSet);
          this.report.dictionary.synchronize();
          resolve(true);
        }
        else {
          reject(true);
        }
      })
      setTimeout(() => {
      }, 500);
    })
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.ReportService.report_file(this.data.id).subscribe(res => {
        if (res) {
          var url = window.URL.createObjectURL(res);
          console.log('stimul url', url);
          this.report.loadFile(url);
          resolve(true);
        }
        else {
          reject(true);
        }
      })
      setTimeout(() => {
       // resolve(true);
      }, 500);
    })
  }

}
