
import { ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlContainer, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'kt-file-upload2',
  templateUrl: './file-upload2.component.html',
  styleUrls: ['./file-upload2.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileUpload2Component),
    multi: true
  }],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]

})

export class FileUpload2Component implements OnInit {

	public form: FormGroup;
	public formControl : FormControl;
	
    constructor(private controlContainer:ControlContainer ,	
		private cdr: ChangeDetectorRef,
		
		) { }

	@Input() controlName:string;

	@Input()  imgBase64: any;
	@Input()  	imgURL:any;
  ngOnInit(): void {

	console.log('controlName',this.controlName)   

    this.form = <FormGroup>this.controlContainer.control;
    this.formControl = <FormControl>this.form.get(this.controlName);
  }



  isFileControlHasError:boolean;
	uploadImage:any;

	onFileChange(imgFile) {


		const reader = new FileReader();
		if (imgFile.target.files && imgFile.target.files[0]) {
		  let file = imgFile.target.files[0];
		  if (!file.name.match(/(\.jpg|\.png|\.JPG|\.PNG|\.jpeg|\.JPEG)$/)) {
				this.isFileControlHasError = true;
			//this.authNoticeService.setNotice('jpg uazantılı dosya yükleyin', 'danger');

		//	this.registerForm.get('resim').setValue(null);
		  } else {
			if (file.size > 1024 * 1024 * 1) {
				this.isFileControlHasError = true;
		
			 //this.registerForm.get('resim').setValue(null);
			} else {
				this.isFileControlHasError = false;
				//console.log('else girdi',this.registerForm.get('resim').value)
			  reader.readAsDataURL(file);

			  reader.onload = () => {
			
					this.imgURL = reader.result;

			
		  
			this.cdr.markForCheck();
				this.ChangeImg();	
		
			  };

			}
	
		  }	
		}
	  }	



	  ChangeImg(): void {
		setTimeout(() => {
			if(this.imgURL)
			{
			  this.formControl.setValue(this.imgURL);
			}
			else
			{
			  if(this.imgBase64)
			   this.formControl.setValue(this.imgBase64);
			}	
		}, 1500);	
	  }

}
