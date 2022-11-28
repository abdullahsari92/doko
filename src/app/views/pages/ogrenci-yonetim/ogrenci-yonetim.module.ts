import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { OgrenciAddComponent } from './ogrenci-add/ogrenci-add.component';
import { OgrenciComponent } from './ogrenci.component';
import { OgrenciDetailComponent } from './ogrenci-detail/ogrenci-detail.component';

const routes: Routes = [

	{
		path: '', component: OgrenciComponent
	},
	{
		path: 'list', component: OgrenciComponent
	},
	{
		path: 'add', component: OgrenciAddComponent
	},
	{
		path: 'detail', component: OgrenciDetailComponent
	}

];
@NgModule({
	declarations: [OgrenciComponent, OgrenciAddComponent, OgrenciDetailComponent],
	imports: [
		CommonModule,
		// TranslateModule.forChild(),
		PartialsModule,
		SharedModule,
		CoreModule,
		RouterModule.forChild(routes),

	]
})
export class OgrenciYonetimModuleModule { }
