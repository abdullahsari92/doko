import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '../theme/base/base.component';
import { AuthenticationGuard } from '../../../app/authentication.guard';
import { ErrorPageComponent } from '../theme/content/error-page/error-page.component';

const routes: Routes = [

	//{path: 'auth', loadChildren: () => import('../pages/auth/adminAuth.module').then(m => m.AdminAuthModule)},

  {
		path: '',
		component: BaseComponent,
		canActivate: [AuthenticationGuard],
		children: [
			{
				path: '',
				loadChildren: () => import('../../../app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},	
			
			{
				path: 'dashboard',
				loadChildren: () => import('../../../app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},		
			{
				path: 'builder',
				loadChildren: () => import('../../../app/views/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{
				path: 'genel_yonetim',
				loadChildren: () => import('../../../app/views/pages/genel-yonetim/genel-yonetim.module').then(m => m.GenelYonetimModule)
			},
			{
				path: 'birim_yonetim',
				loadChildren: () => import('../../../app/views/pages/birim-yonetim/birim-yonetim.module').then(m => m.BirimYonetimModule)
			},
			{
				path: 'basvuru',
				loadChildren: () => import('../../../app/views/pages/basvuru-yonetim/basvuru-yonetim.module').then(m => m.BasvuruYonetimModule)
			},

			{
				path: 'basvuru',
				loadChildren: () => import('../../../app/views/pages/basvuru-yonetim/basvuru-yonetim.module').then(m => m.BasvuruYonetimModule)
			},
			
			{
				path: 'basvuru/sinav-basvuru',
				loadChildren: () => import('../pages/sinav-yonetim/sinav-yonetim.module').then(m => m.SinavYonetimModule)
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'admin/dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		RouterModule.forChild(routes),
		//AdminAuthModule.forRoot()
  ]
})
export class AdminModule { }
