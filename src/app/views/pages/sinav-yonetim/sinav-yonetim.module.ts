import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BasvuruBildirimlerAddComponent } from '../basvuru-yonetim/basvuru-bildirimler/basvuru-bildirimler-add/basvuru-bildirimler-add.component';
import { BasvuruBildirimlerComponent } from '../basvuru-yonetim/basvuru-bildirimler/basvuru-bildirimler.component';
import { SinavOgrencilerComponent } from './sinav-ogrenciler/sinav-ogrenciler.component';
import { SinavBasvuruAddComponent } from './sinav-basvuru/sinav-basvuru-add/sinav-basvuru-add.component';
import { SinavBasvuruComponent } from './sinav-basvuru/sinav-basvuru.component';
import { SinavDetayLayoutComponent } from './sinav-detay-layout/sinav-detay-layout.component';
import { SinavIslemlerComponent } from './sinav-islemler/sinav-islemler/sinav-islemler.component';
import { SinavMerkezComponent } from './sinav-merkez/sinav-merkez.component';
import { SinavOgrencilerEditComponent } from './sinav-ogrenciler/edit/sinav-ogrenciler-edit/sinav-ogrenciler-edit.component';
import { SinavRaporlarPreviewComponent } from './sinav-raporlar/sinav-raporlar-preview/sinav-raporlar-preview.component';
import { SinavRaporlarComponent } from './sinav-raporlar/sinav-raporlar.component';
import { SinavSalonComponent } from './sinav-salon/sinav-salon.component';
import { SinavMerkezAddComponent } from './sinav-merkez/sinav-merkez-add/sinav-merkez-add.component';
import { SinavOgrencilerImportComponent } from './sinav-ogrenciler/import/sinav-ogrenciler-import/sinav-ogrenciler-import.component';
import { TopluSinavOnayComponent } from './sinav-ogrenciler/toplu-sinav-onay/toplu-sinav-onay.component';
import { SinavSalonAddComponent } from './sinav-salon/sinav-salon-add/sinav-salon-add.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GoogleChartsModule } from 'angular-google-charts';
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [

	{ path: '', component: SinavBasvuruComponent },
	{
		path: '', component: SinavDetayLayoutComponent, children: [
			{ path: 'student/:basvuruId', component: SinavOgrencilerComponent },
			{ path: 'bildirim/:basvuruId', component: BasvuruBildirimlerComponent },
			{ path: 'basvuru-bildirimler/add', component: BasvuruBildirimlerAddComponent },
			{ path: 'add', component: SinavBasvuruAddComponent, },
			{ path: 'sinav-merkezleri', component: SinavMerkezComponent },
			{ path: 'raporlar/:basvuruId', component: SinavRaporlarComponent },
			{ path: 'raporlar-preview/:basvuruId', component: SinavRaporlarPreviewComponent },
			{ path: 'sinav-salonlar/:id', component: SinavSalonComponent },
			{ path: 'islemler/:basvuruId', component: SinavIslemlerComponent },
			{ path: 'student/edit', component: SinavOgrencilerEditComponent },

		]
	},

];



@NgModule({
  declarations: [
	SinavDetayLayoutComponent,
		SinavIslemlerComponent,
		SinavOgrencilerComponent,
		SinavOgrencilerEditComponent,
		SinavOgrencilerImportComponent,
		SinavRaporlarComponent,
		SinavRaporlarPreviewComponent,
		SinavBasvuruComponent,
		SinavBasvuruAddComponent,
		SinavMerkezComponent,
		SinavMerkezAddComponent,
		SinavSalonComponent,
		SinavSalonAddComponent,
		TopluSinavOnayComponent,
    
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
export class SinavYonetimModule { }
