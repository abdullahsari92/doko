import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../../core/_base/layout/services/translation.service';

@Component({
  selector: 'kt-auth.height100',
  templateUrl: './auth.component.html',
  styleUrls: [
  	'./auth.component.scss'
  ]
})
export class AuthComponent implements OnInit {


    constructor(private translationService: TranslationService) { }

  ngOnInit(): void {

		//this.translationService.setLanguageStudent(this.translationService.getSelectedLanguageStudent());

  }

}
