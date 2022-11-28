import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { OrtakBasvurAddComponent } from './ortak-basvuru/ortak-basvur-add/ortak-basvur-add.component';
import { OrtakBasvuruComponent } from './ortak-basvuru/ortak-basvuru.component';
import { DoktoraBasvuruComponent } from './doktora-basvuru/doktora-basvuru.component';
import { DoktoraBasvuruAddComponent } from './doktora-basvuru/doktora-basvuru-add/doktora-basvuru-add.component';
import { GirisUcretiBasvuruComponent } from './giris-ucreti-basvuru/giris-ucreti-basvuru.component';
import { GirisUcretiBasvuruAddComponent } from './giris-ucreti-basvuru/giris-ucreti-basvuru-add/giris-ucreti-basvuru-add.component';
import { YuksekLisansBasvuruComponent } from './yuksek-lisans-basvuru/yuksek-lisans-basvuru.component';
import { YuksekLisansBasvuruAddComponent } from './yuksek-lisans-basvuru/yuksek-lisans-basvuru-add/yuksek-lisans-basvuru-add.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BasvuruOgrencilerComponent } from './basvuru-ogrenciler/basvuru-ogrenciler.component';
import { BasvuruOgrencilerEditComponent } from './basvuru-ogrenciler/edit/basvuru-ogrenciler-edit.component';
import { BasvuruOgrencilerImportComponent } from './basvuru-ogrenciler/basvuru-ogrenciler-import/basvuru-ogrenciler-import.component';
import { BasvuruBolumlerComponent } from './basvuru-bolumler/basvuru-bolumler.component';
import { BasvuruBolumlerAddComponent } from './basvuru-bolumler/basvuru-bolumler-add/basvuru-bolumler-add.component';
// import { KontenjanComponent } from './basvuru-bolumler/basvuru-bolumler-kontenjan/kontenjan.component';
// import { KontenjanAddComponent } from './basvuru-bolumler/basvuru-bolumler-kontenjan/kontenjan-add/kontenjan-add.component';
import { BasvuruDetayLayoutComponent } from './basvuru-detay-layout/basvuru-detay-layout.component';
import { LisansBasvuruComponent } from './lisans-basvuru/lisans-basvuru.component';
import { LisansBasvurAddComponent } from './lisans-basvuru/lisans-basvur-add/lisans-basvur-add.component';
import { BasvuruBildirimlerComponent } from './basvuru-bildirimler/basvuru-bildirimler.component';
import { BasvuruBildirimlerAddComponent } from './basvuru-bildirimler/basvuru-bildirimler-add/basvuru-bildirimler-add.component';
import { BasvuruIslemlerComponent } from './basvuru-islemler/basvuru-islemler/basvuru-islemler.component';
import { TopluOnayComponent } from './basvuru-ogrenciler/toplu-onay/toplu-onay.component';
const routes: Routes = [

	{ path: 'lisans-basvuru', component: LisansBasvuruComponent },
	{
		path: '', component: BasvuruDetayLayoutComponent, children: [
			{ path: 'basvuru/add', component: OrtakBasvurAddComponent },
			{ path: 'lisans-basvuru/add', component: LisansBasvurAddComponent },
			{ path: 'yuksek-lisans-basvuru/add', component: YuksekLisansBasvuruAddComponent },
			{ path: 'doktora-basvuru/add', component: DoktoraBasvuruAddComponent },
			{ path: 'giris-ucreti-basvuru/add', component: GirisUcretiBasvuruAddComponent },
			{ path: 'bolumler/add', component: BasvuruBolumlerAddComponent },
			// { path: 'bolumler/kontenjan', component: KontenjanComponent },
			{ path: 'bolumler/:basvuruId', component: BasvuruBolumlerComponent },
			{ path: 'student/:basvuruId', component: BasvuruOgrencilerComponent },
			{ path: 'bildirim/:basvuruId', component: BasvuruBildirimlerComponent },
			{ path: 'islemler/:basvuruId', component: BasvuruIslemlerComponent },
			{ path: 'student/edit', component: BasvuruOgrencilerEditComponent },

		]
	},
	{ path: 'doktora-basvuru', component: DoktoraBasvuruComponent },
	{ path: 'yuksek-lisans-basvuru', component: YuksekLisansBasvuruComponent },
	{ path: 'giris-ucreti-basvuru', component: GirisUcretiBasvuruComponent },

];

@NgModule({
	declarations: [
		OrtakBasvuruComponent,
		OrtakBasvurAddComponent,
		DoktoraBasvuruComponent,
		DoktoraBasvuruAddComponent,
		YuksekLisansBasvuruComponent,
		YuksekLisansBasvuruAddComponent,
		GirisUcretiBasvuruComponent,
		GirisUcretiBasvuruAddComponent,
		BasvuruOgrencilerComponent,
		BasvuruOgrencilerEditComponent,
		BasvuruOgrencilerImportComponent,
		BasvuruBolumlerComponent,
		BasvuruBolumlerAddComponent,
		// KontenjanComponent,
		// KontenjanAddComponent,
		BasvuruDetayLayoutComponent,
		LisansBasvurAddComponent,
		LisansBasvuruComponent,
		BasvuruBildirimlerComponent,
		BasvuruBildirimlerAddComponent,
		BasvuruIslemlerComponent,
	

		TopluOnayComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		PartialsModule,
		SharedModule,
		CoreModule,
		GoogleChartsModule,
		CKEditorModule,
	]
})

export class BasvuruYonetimModule { }

