import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationInformationComponent } from './education-information.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../views/pages/shared/shared.module';
import { PartialsModule } from '../../../views/partials/partials.module';
const routes: Routes = [
			{
				path: '',
				component: EducationInformationComponent
			}
];
@NgModule({
  declarations: [
    /* LyceeAdditionalActionsComponent,
    LicenceAdditionalActionsComponent,
    GraduateAdditionalActionsComponent */
  ],
  imports: [
    CommonModule,
		//TranslateModule.forChild(),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
		PartialsModule,
  ],
  exports:[
   // LyceeInformationComponent
  ]
})
export class EducationModule { }
