import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../views/pages/shared/shared.module';
import { PartialsModule } from '../../../views/partials/partials.module';


const routes: Routes = [


];

@NgModule({
declarations: [ 
 // SinavBasvuruComponent,TextDisplayComponent,LisansBasvuruComponent, BasvuruGoruntulemeComponent
],
imports: [
CommonModule,
//TranslateModule.forChild(),
RouterModule.forChild(routes),
FormsModule,
ReactiveFormsModule,
SharedModule,
PartialsModule,


]
})

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class OgrenciBasvuruModule { }