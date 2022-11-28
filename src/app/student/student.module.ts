import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { EducationModule } from './pages/education-information/education.module';
import { PagesModule } from './pages/pages.module';
import { AuthGuard } from './auth.guard';
import { PartialsModule } from '../views/partials/partials.module';

// const routes: Routes = [
// 	{ path: 'auth', loadChildren: () => import('../student/pages/auth/auth.module').then(m => m.AuthModule) },
// 	{
// 		path: '',
// 		canActivate: [AuthGuard],
// 		canActivateChild: [AuthGuard],
// 		loadChildren: () => import('../student/pages/pages.module').then(m => m.PagesModule)
// 	},

// 	//{path: '**', redirectTo: '/auth'}
// ];

@NgModule({
	declarations: [],
	imports: [
		FormsModule,
		HttpClientModule,
		CommonModule,
		PartialsModule,
		//RouterModule.forChild(routes)
	],
	providers: [
		AuthGuard,
		// { provide: HTTP_INTERCEPTORS, useClass: StudentInterceptor, multi: true }
	]
})
export class StudentModule {
	constructor() {}
}