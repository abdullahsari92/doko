// Angular
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// NgBootstrap
import { NgbDropdownModule,NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

//import {NgbDropdownModule, NgbTabsetModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
// Perfect Scrollbar
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
// Core module
import {CoreModule} from '../../core/core.module';
// CRUD Partials
import {
	ActionNotificationComponent,
	AlertComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent,
} from './content/crud';
// Layout partials
import {
	ContextMenu2Component,
	ContextMenuComponent,
	LanguageSelectorComponent,
	ScrollTopComponent,
	SearchResultComponent,
	SplashScreenComponent,
	UserProfile2Component,	
} from './layout';
// General
import {NoticeComponent} from './content/general/notice/notice.component';
import {PortletModule} from './content/general/portlet/portlet.module';
// Errpr
import {ErrorComponent} from './content/general/error/error.component';
// SVG inline
import {InlineSVGModule} from 'ng-inline-svg';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomAgGridComponent } from './ag-grid/custom-ag-grid/custom-ag-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { AgGridActionComponent } from './ag-grid/components-ag/ag-grid-action/ag-grid-action.component';
import { ChangeStatusComponent } from './ag-grid/components-ag/change-status/change-status.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { EgitimDonemleriComponent } from './layout/topbar/egitim-donemleri/egitim-donemleri.component';
import { FileUploadAllComponent } from './file-upload-all/file-upload-all.component';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { TranslateDataPipe } from '../../core/pipes/translate-data.pipe';
import { AgGridLangComponent } from './ag-grid/components-ag/ag-grid-lang/ag-grid-lang.component';
import { ImgUploadComponent } from './img-upload/img-upload.component';
import { ImgViewComponent } from './img-view/img-view.component';
import { isNullPipe } from '../../core/pipes/isNull.pipe';
import { FileViewerComponent } from './ag-grid/components-ag/file-viewer/file-viewer.component';
import { ImgViewer } from './ag-grid/components-ag/img-viewer/img-viewer.component';

@NgModule({
	declarations: [
		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,
		ContextMenu2Component,
		ContextMenuComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,	
		LanguageSelectorComponent,
		UserProfile2Component,
		AgGridActionComponent,
		ErrorComponent,
		CustomAgGridComponent,	
		FileUploadAllComponent,
		ChangeStatusComponent, 
		AgGridLangComponent,
		FileUploadComponent, 
		EgitimDonemleriComponent,
		ImgUploadComponent,
		TranslatePipe,
		TranslateDataPipe,
		ImgUploadComponent,
		ImgViewComponent,
		FileViewerComponent,
		isNullPipe,
		ImgViewer
	],
	exports: [
		PortletModule,
		EgitimDonemleriComponent,
		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,
		ContextMenu2Component,
		ContextMenuComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,	
		LanguageSelectorComponent,		
		UserProfile2Component,
		CustomAgGridComponent,
		NgbDropdownModule,
		NgbTooltipModule,
		ErrorComponent,
		AgGridModule,
		MatFileUploadModule,
		FileUploadComponent,
		FileUploadAllComponent,
		TranslatePipe,
		isNullPipe,
		TranslateDataPipe,
		ImgUploadComponent,
		ImgViewComponent,
		ImgViewer
		
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		PerfectScrollbarModule,
		InlineSVGModule,
		CoreModule,
		PortletModule,
		MatFileUploadModule,

		// angular material modules
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule,
		// ng-bootstrap modules
		NgbDropdownModule,
		//NgbTabsetModule,
		NgbTooltipModule,
		//TranslateModule.forChild(),

		AgGridModule.withComponents([AgGridActionComponent,ChangeStatusComponent,AgGridLangComponent,FileViewerComponent]),
	],
})
export class PartialsModule {
}
