// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Auth
import { AuthGuard } from '../app/student/auth.guard';
import { AuthComponent } from './student/pages/auth/auth.component';
import { LoginComponent } from './student/pages/auth/login/login.component';
import { RegisterComponent } from './student/pages/auth/register/register.component';
import { StudentModule } from './student/student.module';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: '',
				component: LoginComponent

			},
			{
				path: 'login',
				component: LoginComponent

			},
			{
				path: 'register',
				component: RegisterComponent
			}
			/* ,
			{
				path: 'forgot-password',
				component: ForgotPasswordComponent,
			} */
		]
	},
	{
		path: '',
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		loadChildren: () => import('../app/student/pages/pages.module').then(m => m.PagesModule)
	},

	{path: 'admin/auth', loadChildren: () => import('./views/pages/auth/adminAuth.module').then(m => m.AdminAuthModule)},
	{path: 'admin', loadChildren: () => import('../app/views/admin/admin.module').then(m => m.AdminModule)},


	{ path: '**', redirectTo: 'error/403', pathMatch: 'full' }
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { useHash: true }),
		StudentModule

	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
