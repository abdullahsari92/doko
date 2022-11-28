import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, ControlContainer, NG_VALUE_ACCESSOR, FormGroupDirective } from '@angular/forms';
import { FileResult } from '../../../core/models/fileResult';

@Component({
  selector: 'app-img-upload',
  templateUrl: './img-upload.component.html',
  styleUrls: ['./img-upload.component.css'],
  providers: [{
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => ImgUploadComponent),
	multi: true
}],
viewProviders: [
	{
		provide: ControlContainer,
		useExisting: FormGroupDirective
	}
]
})
export class ImgUploadComponent implements OnInit {
    public form!: FormGroup;
	public formControl!: FormControl;


	public fileUploadQueue: any;
	constructor(private controlContainer: ControlContainer,
		private cdr: ChangeDetectorRef,

	) { }

	@Input() controlName!: string;



	@Input() imgBase64: any;
	@Input() imgURL: any;
	@Input() subMessage!:string;

	@Input() multiple: boolean=true;

 resultFiles: FileResult[] = [];
 @Output() files: EventEmitter<FileResult[]> = new EventEmitter();
 @Output() confirm: EventEmitter<any> = new EventEmitter(); 
 @Output() close: EventEmitter<any> = new EventEmitter();
 @Output() chance: EventEmitter<any> = new EventEmitter();

 @Input() isSaveButton:boolean=true;


	ngOnInit(): void {


		this.form = <FormGroup>this.controlContainer.control;
		this.formControl = <FormControl>this.form.get(this.controlName);

	}



	isFileControlHasError: boolean | undefined;
	uploadImage: any;


	onFileChance(imgFile: any) {

		this.resultFiles = [];
		if (imgFile) {
			
					
				const reader = new FileReader();

				console.log('imgFile.target',imgFile.target.files)
				let file = imgFile.target.files[0];

				if (!file.name.match(/(\.jpg|\.png|\.JPG|\.PNG|\.jpeg|\.JPEG)$/)) {
					this.isFileControlHasError = true;
				}
				else {
					if (file.size > 10024 * 1024 * 1) {
						this.isFileControlHasError = true;
					} else {
						this.isFileControlHasError = false;
						reader.readAsDataURL(file);
						reader.onload = () => {

							this.imgBase64 = reader.result;
							this.imgURL = reader.result;

							this.chance.emit(true);
							this.cdr.markForCheck();
							this.ChangeImg(file.type);

						};

					}
				}
	

		}


	}
	ChangeImg(type: any): void {

		type = type.split("/")[1];
		setTimeout(() => {
			if (this.imgURL) {
				this.formControl.setValue(this.imgURL);
			}
			else {
				if (this.imgBase64)
					this.formControl.setValue(this.imgBase64);
			}
		}, 2500);
	}


	save(){

		this.files.emit(this.resultFiles);
		if(this.multiple)
		  this.confirm.emit(this.resultFiles);
		  else
		  this.confirm.emit(this.resultFiles[0]);

	}

	removeItem(i: any) {

		this.resultFiles.splice(i, 1);
		this.formControl.setValue("");
		console.log('imgUrlList ', this.resultFiles)
	}



	isControlHasError(controlName: string, validationType: string,form:FormGroup): boolean {

		const control = form.controls[controlName];
		if (!control) {
			return false;
		}
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

}
