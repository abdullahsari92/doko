import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PartialsModule } from '../../partials/partials.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { YetkiAddComponent } from './yetki/add/yetki-add.component';
import { YetkiListComponent } from './yetki/list/yetki-list.component';
import { KonsoloslukAddComponent } from './konsolosluk/konsolosluk-add/konsolosluk-add.component';
import { KonsoloslukListComponent } from './konsolosluk/konsolosluk-list/konsolosluk-list.component';
import { BankaListComponent } from './banka/banka-list/banka-list.component';
import { BankaAddComponent } from './banka/banka-add/banka-add.component';
import { UlkeListComponent } from './ulke/ulke-list/ulke-list.component';
import { UlkeAddComponent } from './ulke/ulke-add/ulke-add.component';
import { KurumListComponent } from './kurum/kurum-list/kurum-list.component';
import { KurumAddComponent } from './kurum/kurum-add/kurum-add.component';
import { BirimListComponent } from './birim/birim-list/birim-list.component';
import { BirimAddComponent } from './birim/birim-add/birim-add.component';
import { KullaniciListComponent } from './kullanici/kullanici-list/kullanici-list.component';
import { KullaniciAddComponent } from './kullanici/kullanici-add/kullanici-add.component';
import { DilListComponent } from './dil/dil-list/dil-list.component';
import { DilAddComponent } from './dil/dil-add/dil-add.component';
import { SettingsAddComponent } from './settings/settings-add/settings-add.component';
import { SettingsListComponent } from './settings/settings-list/settings-list.component';

const routes: Routes = [

	{
		path: 'yetki', component: YetkiListComponent,
		children: [
			{
				path: 'list', component: YetkiListComponent
			},
			{
				path: 'add', component: YetkiAddComponent
			}
		]
	},
	{ path: 'birim', component: BirimListComponent },
	{
		path: 'birim/list', component: BirimListComponent
	},
	{
		path: 'birim/add', component: BirimAddComponent
	},
	{
		path: 'konsolosluk', component: KonsoloslukListComponent,
		children: [
			{
				path: 'list', component: KonsoloslukListComponent
			},
			{
				path: 'add', component: KonsoloslukAddComponent
			}
		]
	},
	{
		path: 'banka', component: BankaListComponent,
		children: [
			{
				path: 'list', component: BankaListComponent
			},
			{
				path: 'add', component: BankaAddComponent
			}
		]
	},
	{
		path: 'ulke', component: UlkeListComponent,
		children: [
			{
				path: 'list', component: UlkeListComponent
			},
			{
				path: 'add', component: UlkeAddComponent
			}
		]
	},
	{
		path: 'kurum', component: KurumListComponent,
		children: [
			{
				path: 'list', component: KurumListComponent
			},
			{
				path: 'add', component: KurumAddComponent
			}
		]
	},
	{
		path: 'kullanici', component: KullaniciListComponent,
		children: [
			{
				path: 'list', component: KullaniciListComponent
			},
			{
				path: 'add', component: KullaniciAddComponent
			}
		]
	},
	{
		path: 'dil', component: DilListComponent,
		children: [
			{
				path: 'list', component: DilListComponent
			},
			{
				path: 'add', component: DilAddComponent
			}
		]
	},
	{
		path: 'settings', component: SettingsListComponent,
		children: [
			{
				path: 'list', component: SettingsListComponent
			},
			{
				path: 'add', component: SettingsAddComponent
			}
		]
	},

];

@NgModule({
	declarations: [
		YetkiListComponent, YetkiAddComponent,
		KonsoloslukAddComponent, KonsoloslukListComponent,
		BankaListComponent, BankaAddComponent,
		UlkeListComponent, UlkeAddComponent,
		KurumListComponent, KurumAddComponent,
		BirimListComponent, BirimAddComponent,
		KullaniciListComponent, KullaniciAddComponent,
		DilListComponent, DilAddComponent,
		SettingsAddComponent, SettingsListComponent],
	imports: [
		CommonModule,
		//TranslateModule.forChild(),
		RouterModule.forChild(routes),
		PartialsModule,
		SharedModule,
		CoreModule
	]
})
export class GenelYonetimModule { }
