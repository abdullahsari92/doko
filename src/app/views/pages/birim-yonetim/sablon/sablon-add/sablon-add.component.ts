import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '../../../../../core/services/translate.service';
import { Stimulsoft } from 'stimulsoft-reports-js/Scripts/stimulsoft.blockly'
import { DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../../../../views/services/report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SablonListComponent } from '../sablon-list/sablon-list.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { StimulSablonModel } from '../../../../../views/models/stimulSablon';
import { DokoSettingsService } from '../../../../../core/services/doko-settings.service';

@Component({
  selector: 'kt-sablon-add',
  templateUrl: './sablon-add.component.html',
  styleUrls: ['./sablon-add.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class SablonAddComponent implements OnInit {

  options: any = new Stimulsoft.Designer.StiDesignerOptions();
  designer: any = new Stimulsoft.Designer.StiDesigner(this.options, 'StiDesigner', false);

  // Window.Stimulsoft

  //Stimulsoft = window['Stimulsoft'] || [];
  json: any;
  report: any;
  sablonForm: FormGroup;
  sablon_tanimlari_id: any;

  stimulSablonModel: StimulSablonModel = new StimulSablonModel()
  constructor(
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private ReportService: ReportService,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    public dialogRef: MatDialogRef<SablonListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dokoSettingsService: DokoSettingsService

  ) {

    //console.log('this.data.ss ', this.data.sablon_tanimlari_id)
    //console.log('this.data', this.data)

    this.sablon_tanimlari_id = this.data.sablon_tanimlari_id;
    // this.ReportService.getListReportData(dataID).subscribe(res =>{
    // })
  }
  ngOnInit(): void {
    this.stimulSoftGet();
  }

  stimulSoftGet() {

    Stimulsoft.Base.StiLicense.key = this.dokoSettingsService.StimulsoftBaseStiLicensekey;
    this.getColum().then(() => {
      this.getData().then(() => {

        //this.report.loadFile("reports/Report2.json");	
        var thisFunc = this;
        this.designer.onSaveReport = function (args) {
          var report = args.report;
          var str = report.saveToJsonString();
          //console.log('str ', str)
          var ReportFile = JSON.parse(str.split(',')).ReportFile;
          //console.log('ReportFile ', ReportFile)
          var stimulSablon = JSON.stringify(str);

          if (thisFunc.data.id)//güncelleme
          {
            thisFunc.stimulSablonModel = {
              sablon: str,
              adi: ReportFile,
              id: thisFunc.data.id,
              durumu: "1",
              sablon_tanimlari_id: thisFunc.data.sablon_tanimlari_id,
              dil:'',
            }
          }
          else {
            thisFunc.stimulSablonModel = {
              adi: ReportFile,
              sablon_tanimlari_id: thisFunc.sablon_tanimlari_id,
              sablon: str,
              id: null,
              durumu: "1",
              dil:'',
            };
          }
          thisFunc.getSave(thisFunc.stimulSablonModel);
        }

        //this.options.appearance.fullScreenMode = true;
        // this.options.toolbar.showPreviewButton = false;
        // this.options.toolbar.showFileMenu = false;
        // this.options.components.showImage = false;
        // this.options.components.showShape = false;
        // this.options.components.showPanel = false;
        // this.options.components.showCheckBox = false;
        // this.options.components.showSubReport = false;

        this.designer.renderHtml("designerContent");
      });

    }).catch((err: any) => {
      //console.log('catch girdi ',)
    });



  }

  getColum() {
    return new Promise((resolve, reject) => {
      this.report = Stimulsoft.Report.StiReport.createNewReport();
      this.ReportService.getListColumnName(this.data.sablon_tanimlari_id).subscribe(res => {
        if (res) {
          var myString = res.data.data_format;
         // console.log('myArray', myString)
          var myArray = myString.split(',');
          this.json = JSON.parse(myArray);

          var dataSet = new Stimulsoft.System.Data.DataSet("Veri Alanları");
          dataSet.readJson(this.json);

          this.report.regData(dataSet.dataSetName, '', dataSet);
          this.report.dictionary.synchronize();
          this.designer.report = this.report;
        }
        else {
          reject(true);
        }
      })
      setTimeout(() => {
        resolve(true);
      }, 500);
    })

  }

  getSave(stimulSablonModel) {

    console.log(' repoert post stimulSablonModel', stimulSablonModel);
    const _messageType = MessageType.Update;
    this.ReportService.getReportSave(stimulSablonModel).subscribe(res => {
     // console.log(' gelen post stimulSablonModel', res);
      //console.log('gelen res',stimulSablonModel.id);

      if (res.result) {
         let saveMessageTranslateParam = stimulSablonModel.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL") : this.translate.instant("TEXT.SAVE_SUCCESSFUL");
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000, false, false, null, 'top');
        //this.goBackWithoutId();
      }
      else {

        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000, false, false, null, 'top');
      }

    });



  }

  getData() {

    //console.log('getdataaaa')

    return new Promise((resolve, reject) => {
      this.ReportService.report_file(this.data.id).subscribe(res => {
        if (res) {
         // console.log(' report_file res', res);
          var url = window.URL.createObjectURL(res);
          //console.log(' report_file url', url)
          //   this.report = Stimulsoft.Report.StiReport.createNewReport();
          this.report.loadFile(url);

          // this.ReportService.getListColumnName(this.data).subscribe(res => {
          //   if (res.result) {
          //     var StringifyData = JSON.stringify(res.data.data_format);

          //     this.data.forEach((item)=>{
          //       var obj;
          //       obj={
          //         Parent:item.Parent,
          //         text:item.BrandName,
          //       }
          //      this.json.push(obj)
          //   });

          //   }
          // })  

        }
        else {
          reject(true);
        }
      })

      setTimeout(() => {

        resolve(true);
      }, 500);
    })
  }


}
