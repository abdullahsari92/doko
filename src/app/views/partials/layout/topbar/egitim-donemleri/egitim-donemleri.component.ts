import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BirimYonetimService } from '../../../../services/birim_yonetim.service';
import { AuthenticationService } from '../../../../services/auth.service';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { EgitimDonemi } from '../../../../models/egitimDonemi';

import { TranslationService } from '../../../../../core/_base/layout';


@Component({
  selector: 'kt-egitim-donemleri',
  templateUrl: './egitim-donemleri.component.html',
  styleUrls: ['./egitim-donemleri.component.scss']
})
export class EgitimDonemleriComponent implements OnInit {


  egitimDonemleri:EgitimDonemi[]= [];
  language:string;
  constructor(private AuthenticationService:AuthenticationService,
    private localStorageServic:LocalStorageService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {

this.language = this.translationService.getSelectedLanguage();

    this.getEgitimDonemi();
  }


getEgitimDonemi()
{

      
       var localEgitimDonem =  this.localStorageServic.getItem("egitimDonemi") as EgitimDonemi;
      this.AuthenticationService.ListTrainingPeriod().pipe(map(res=>{

            if(res.result)
            {
              this.egitimDonemleri = res.data;        

              this.egitimDonemleri.find(m=> m.id == localEgitimDonem.id).selected = true;
            }
          
      })).subscribe();

  
      //console.log(' egitimDonemleri',this.egitimDonemleri)

}

   
    setEgitimDonemi(item:EgitimDonemi)
    {

       this.egitimDonemleri.forEach(p=>{
         p.selected=false;
       })
       item.selected=true;

       this.localStorageServic.setItem("egitimDonemi", item);

		this.cdr.markForCheck();

    }

}
