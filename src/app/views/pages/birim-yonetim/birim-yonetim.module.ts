import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { SharedModule } from '../shared/shared.module';
// import { BirimListComponent } from './birim/list/birim-list.component';
// import { BirimAddComponent } from './birim/add/birim-add.component';
import { BasvuruListComponent } from './birim-basvuru/list/basvuru-list.component';
import { BasvuruAddComponent } from './birim-basvuru/add/basvuru-add.component';
import { BolumListComponent } from './bolum/bolum-list/bolum-list.component';
import { BolumAddComponent } from './bolum/bolum-add/bolum-add.component';
import { BolumKontenjanComponent } from './bolum/bolum-kontenjan/kontenjan.component';
import { BolumKontenjanAddComponent } from './bolum/bolum-kontenjan/kontenjan-add/kontenjan-add.component';
import { CoreModule } from '../../../core/core.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FakulteListComponent } from './fakulte/fakulte-list/fakulte-list.component';
import { FakulteAddComponent } from './fakulte/fakulte-add/fakulte-add.component';
import { IstenenDillerListComponent } from './istenen-diller/istenen-diller-list/istenen-diller-list.component';
import { IstenenDillerAddComponent } from './istenen-diller/istenen-diller-add/istenen-diller-add.component';
import { KayitTurleriListComponent } from './kayit-turleri/kayit-turleri-list/kayit-turleri-list.component';
import { KayitTurleriAddComponent } from './kayit-turleri/kayit-turleri-add/kayit-turleri-add.component';
import { PuanTurleriListComponent } from './puan-turleri/puan-turleri-list/puan-turleri-list.component';
import { PuanTurleriAddComponent } from './puan-turleri/puan-turleri-add/puan-turleri-add.component';
import { EgitimDonemListComponent } from './egitim-donemi/egitim-donem-list/egitim-donem-list.component';
import { EgitimDonemAddComponent } from './egitim-donemi/egitim-donem-add/egitim-donem-add.component';
import { DilSinavListComponent } from './dil-sinav/dil-sinav-list/dil-sinav-list.component';
import { DilSinavAddComponent } from './dil-sinav/dil-sinav-add/dil-sinav-add.component';
import { SablonListComponent } from './sablon/sablon-list/sablon-list.component';
import { SablonAddComponent } from './sablon/sablon-add/sablon-add.component';
import { SablonPreviewComponent } from './sablon/sablon-preview/sablon-preview.component';
import { SablonEditComponent } from './sablon/sablon-edit/sablon-edit.component';

const routes: Routes = [

	{
		path: 'basvuru/list', component: BasvuruListComponent
	},
	{
		path: 'basvuru/add', component: BasvuruAddComponent
	},

	{
		path: 'bolum/list', component: BolumListComponent
	},
	{
		path: 'bolum/add', component: BolumAddComponent
	},
	{
		path: 'bolum/kontenjan', component: BolumKontenjanComponent
	},
	{
		path: 'bolum/kontenjanadd', component: BolumKontenjanAddComponent
	},
	{
		path: 'fakulte/list', component: FakulteListComponent
	},
	{
		path: 'fakulte/add', component: FakulteAddComponent
	},
	{
		path: 'istenen-diller/list', component: IstenenDillerListComponent
	},
	{
		path: 'istenen-diller/add', component: IstenenDillerAddComponent
	},
	{
		path: 'kayit-turleri/list', component: KayitTurleriListComponent
	},
	{
		path: 'kayit-turleri/add', component: KayitTurleriAddComponent
	},
	{
		path: 'puan-turleri/list', component: PuanTurleriListComponent
	},
	{
		path: 'puan-turleri/add', component: PuanTurleriAddComponent
	},
	{
		path: 'egitim-donemi/list', component: EgitimDonemListComponent
	},
	{
		path: 'egitim-donemi/add', component: EgitimDonemAddComponent
	},
	{
		path: 'dil-sinav/list', component: DilSinavListComponent
	},
	{
		path: 'dil-sinav/add', component: DilSinavAddComponent
	},
	{
		path: 'sablon/list', component: SablonListComponent
	},
	{
		path: 'sablon/add', component: SablonAddComponent
	},
	{
		path: 'sablon/edit', component: SablonEditComponent
	},

];

@NgModule({
	declarations: [
		// BirimListComponent, BirimAddComponent,
		BasvuruListComponent, BasvuruAddComponent,
		BolumListComponent, FakulteAddComponent,
		BolumAddComponent, FakulteListComponent,
		IstenenDillerListComponent, IstenenDillerAddComponent,
		KayitTurleriListComponent, KayitTurleriAddComponent,
		PuanTurleriListComponent, PuanTurleriAddComponent,
		EgitimDonemListComponent, EgitimDonemAddComponent,
		DilSinavListComponent, DilSinavAddComponent,
		SablonListComponent, SablonAddComponent,
		SablonPreviewComponent, SablonEditComponent,
		BolumKontenjanComponent, BolumKontenjanAddComponent
	],
	imports: [
		CommonModule,
		//	TranslateModule.forChild(),
		RouterModule.forChild(routes),
		PartialsModule,
		SharedModule,
		CoreModule,
		CKEditorModule,
	]
})

export class BirimYonetimModule { }
