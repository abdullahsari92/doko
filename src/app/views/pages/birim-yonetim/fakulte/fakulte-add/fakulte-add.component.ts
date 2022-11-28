import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../../../../../core/services/translate.service';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { BirimYonetimService } from '../../../../../views/services/birim_yonetim.service';

@Component({
  selector: 'kt-fakulte-add',
  templateUrl: './fakulte-add.component.html',
  styleUrls: ['./fakulte-add.component.scss']
})
export class FakulteAddComponent implements OnInit {

  fakulteForm: FormGroup;
	hasFormErrors = false;
	loading = false;
  data:any;
	buttonSave:string= this.translate.instant("TEXT.SAVE");
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

  ngOnInit(): void {

    this.initRegisterForm();
  }


  initRegisterForm() {


		this.fakulteForm = this.fb.group({

      adi_tr  : ["", Validators.compose([ Validators.required,Validators.maxLength(400)])]	,
      adi_en  :["", Validators.compose([ Validators.required,Validators.maxLength(6)])]	,
      kodu  :["", Validators.compose([ Validators.required,Validators.maxLength(4)])],
      durumu  :[true],
		});

    
    if(this.data)
    {
      this.fakulteForm.addControl("id",new FormControl());
      const controls = this.fakulteForm.controls;
      Object.keys(controls).forEach(controlName =>{
          controls[controlName].setValue(this.data[controlName])
        });

        this.durumuText =  this.data.durumu ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE");


    }

        
	}

  ObjectContorls()
  {
    const controls = this.fakulteForm.controls;

    return Object.keys(controls);
  }

  ifTextBox(item):boolean
	{	
		if( item=="durumu" || item=="id")
		{ 
			return false;
		 }
		else{
		//	this.fakulteForm.get(item).setValue("te");
			return true;
		 }
	
	}
  onSumbit()
  {


    var data = this.fakulteForm.value;

  //  return;
		const _messageType = data.id ? MessageType.Update : MessageType.Create;

    this.BirimYonetimService.saveFaculty(data).subscribe(res=>{

        //console.log('resunit save : ',res)
        if(res.result)
        {
          let saveMessageTranslateParam =data.id ? this.translate.instant("TEXT.UPDATE_SUCCESSFUL"):this.translate.instant("TEXT.SAVE_SUCCESSFUL")
          const _saveMessage = this.translate.instant(saveMessageTranslateParam);

        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 3000,false , false,null,'top');

          this.goBackWithoutId();
        }
        else{   

        this.layoutUtilsService.showActionNotification(res.error.message, _messageType, 3000,false , false,null,'top');
        }
      
      
    });

  }
  durumuText:string=this.translate.instant("TEXT.ACTIVE");
  //1 durum 
  //2 kayit_turu
  //3 uyruk_bilgisi
  changeStatu()
  {    
        this.durumuText =  this.durumuText == this.translate.instant("TEXT.PASSIVE") ? this.translate.instant("TEXT.ACTIVE") : this.translate.instant("TEXT.PASSIVE"); 
  }




  goBack(id) {
		const url = `/ecommerce/products?id=${id}`;
		this.router.navigate([url], { relativeTo: this.activatedRoute });

	}


	goBackWithoutId() {
		this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
	}

  getComponentTitle() {
		let result = this.translate.instant("TITLE.fakulte_tanim");
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
		const control = this.fakulteForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);

    // if(control.errors['maxlength'])
    // {
    //   console.log(' maxlengtfield',control.errors['maxlength'] );

    // }

		return result;
	}

  submit()
  {

    //console.log('this.yetkiTanimForm.value;',this.fakulteForm.value)
   // this.yetkiTanimForm.value;


   const controls = this.fakulteForm.controls;
   /** check form */
   if (this.fakulteForm.invalid) {
     Object.keys(controls).forEach(controlName =>
       controls[controlName].markAsTouched()
     );
     return;
   }

   	



  }
}
