import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { BirimYonetimService } from '../../../../../views/services/birim_yonetim.service';

@Component({
  selector: 'kt-kayit-turleri-add',
  templateUrl: './kayit-turleri-add.component.html',
  styleUrls: ['./kayit-turleri-add.component.scss']
})
export class KayitTurleriAddComponent implements OnInit {

  
  kayitTurleriForm: FormGroup;
	hasFormErrors = false;
	loading = false;
  data:any;
	buttonSave:string=this.translate.instant("TEXT.SAVE"); 
    constructor(	private fb: FormBuilder,
		private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private BirimYonetimService:BirimYonetimService,
    private layoutUtilsService: LayoutUtilsService,
    private route:ActivatedRoute,
		private router: Router,
) { 

  this.data = this.router.getCurrentNavigation().extras.state


}

basvuruTurleri= [
  {value:1,key:this.translate.instant("TEXT.sinav")},
  {value:2,key:this.translate.instant("TEXT.lisans")},
  {value:3,key:this.translate.instant("TEXT.yuksek_lisans")},
  {value:4,key:this.translate.instant("TEXT.doktora")},
  ];


  ngOnInit(): void {

    this.initRegisterForm();
  }

  initRegisterForm() {


		this.kayitTurleriForm = this.fb.group({

      adi_tr  : ["", Validators.compose([ Validators.required])],
      adi_en  :["", Validators.compose([ Validators.required])]	,
      aciklama_tr  :["", Validators.compose([ Validators.required])],
      aciklama_en  :["", Validators.compose([Validators.required])],
      basvuru_turu  :["", Validators.compose([Validators.required])],
      durumu  :[true],
		});

    
    if(this.data)
    {
      this.kayitTurleriForm.addControl("id",new FormControl());
      const controls = this.kayitTurleriForm.controls;
      Object.keys(controls).forEach(controlName =>{
          controls[controlName].setValue(this.data[controlName])
        });
        this.durumuText =  this.data.durumu?this.translate.instant("TEXT.ACTIVE"):this.translate.instant("TEXT.PASSIVE");
    }

        
	}

  ObjectContorls()
  {
    const controls = this.kayitTurleriForm.controls;

    return Object.keys(controls);
  }

  ifTextBox(item):boolean
	{	
		if( item=="durumu" || item=="id")
		{ 
			return false;
		 }
		else{
		//	this.kayitTurleriForm.get(item).setValue("te");
			return true;
		 }
	
	}
  onSumbit()
  {


    var data = this.kayitTurleriForm.value;

  //  return;
		const _messageType = data.id ? MessageType.Update : MessageType.Create;

    this.BirimYonetimService.saveRecord(data).subscribe(res=>{

        //console.log('resunit save : ',res)
        if(res.result)
        {
          let saveMessageTranslateParam =data.id?this.translate.instant("TEXT.UPDATE_SUCCESSFUL"): this.translate.instant("TEXT.SAVE_SUCCESSFUL");
          const _saveMessage = this.translate.instant(saveMessageTranslateParam);

        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000,false , false,null,'top');

          this.goBackWithoutId();
        }
        else{   

        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000,false , false,null,'top');
        }
      
      
    });

  }
  durumuText:string =  this.translate.instant("TEXT.ACTIVE");
  //1 durum 
  //2 kayit_turu
  //3 uyruk_bilgisi
  changeStatu()
  {    
    this.durumuText =  this.durumuText == this.translate.instant("TEXT.PASSIVE") ? this.translate.instant("TEXT.ACTIVE"): this.translate.instant("TEXT.PASSIVE"); 
  }




  goBack(id) {
		const url = `/ecommerce/products?id=${id}`;
		this.router.navigate([url], { relativeTo: this.activatedRoute });

	}


	goBackWithoutId() {
		this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
	}

  getComponentTitle() {
		let result = this.translate.instant("TITLE.kayit_turleri_tanim");
		//if (!this.product || !this.product.id) {
			return result;
	//	}

	//	result = `Edit product - ${this.product.manufacture} ${this.product.model}, ${this.product.modelYear}`;
		return result;
	}

	isContorlMessage(saveMessageTranslateParam:string,name)
	{
		//this.authNoticeService.setNotice(this.translate.instant('VALIDATION.NOT_FOUND', {name: this.translate.instant('TEXT.eposta')}), 'danger');

		//console.log(' bankaValid:',this.translate.instant(saveMessageTranslateParam, {name: name}));
       return this.translate.instant(saveMessageTranslateParam,{name: name});
	}
  	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.kayitTurleriForm.controls[controlName];
		if (!control) {
			return false;
		}
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

  submit()
  {

    //console.log('this.yetkiTanimForm.value;',this.kayitTurleriForm.value)
   // this.yetkiTanimForm.value;


   const controls = this.kayitTurleriForm.controls;
   /** check form */
   if (this.kayitTurleriForm.invalid) {
     Object.keys(controls).forEach(controlName =>
       controls[controlName].markAsTouched()
     );
     return;
   }

   	



  }

}
