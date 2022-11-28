
import { ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlContainer, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'doko-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => FileUploadComponent),
		multi: true
	}],
	viewProviders: [
		{
			provide: ControlContainer,
			useExisting: FormGroupDirective
		}
	]
})

export class FileUploadComponent implements OnInit {

	public form!: FormGroup;
	public formControl!: FormControl;
	public formContorlTypeName!: FormControl;


	public fileUploadQueue: any;
	constructor(private controlContainer: ControlContainer,
		private cdr: ChangeDetectorRef,

	) { }

	@Input() controlName!: string;
	@Input() typeName!: string;



	@Input() imgBase64: any;
	@Input() imgURL: any;
	@Input() imgUrlList: any[]=[];


	ngOnInit(): void {

		console.log('controlName', this.controlName)

		this.form = <FormGroup>this.controlContainer.control;
		this.formControl = <FormControl>this.form.get(this.controlName);

		if (this.typeName) this.formContorlTypeName = <FormControl>this.form.get(this.typeName);

	}



	isFileControlHasError: boolean | undefined;
	uploadImage: any;

	onFileChange(imgFile: any) {
		console.log('imgFile', imgFile)
		const reader = new FileReader();
		if (imgFile.target.files && imgFile.target.files[0]) {
			let file = imgFile.target.files[0];
			if (!file.name.match(/(\.jpg|\.png|\.JPG|\.PNG|\.jpeg|\.JPEG)$/)) {
				this.isFileControlHasError = true;

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
						console.log('this.imgURL', this.imgURL)
						this.cdr.markForCheck();
						this.ChangeImg(file.type);

					};

				}

			}
		}
	}

	onFileDragDrop(FileList: any) {
		console.log('imgFile', FileList)
		if (FileList && FileList[0]) {

		
			for( let i = 0; i < FileList.length; i++)
			{
			const reader = new FileReader();

					let file = FileList[i];

					console.log('file ',file)
								
			if (!file.name.match(/(\.jpg|\.png|\.JPG|\.PNG|\.jpeg|\.JPEG)$/)) 
			{
				this.isFileControlHasError = true;
			}
			else 
			{
				if (file.size > 1024 * 1024 * 1) {
					this.isFileControlHasError = true;
				} else {
					this.isFileControlHasError = false;
					reader.readAsDataURL(file);
					reader.onload = () => {
						this.imgUrlList.push(reader.result);

						console.log('this.imgUrlList',this.imgUrlList)
						this.cdr.markForCheck();
						this.ChangeImg(file.type);

					};

				}
			}
			};
			
		}

		
	}

	ChangeImg(type: any): void {

		type = type.split("/")[1];
		setTimeout(() => {
			if (this.imgURL) {
				this.formControl.setValue(this.imgURL);
				if (this.typeName) this.formContorlTypeName.setValue(type)
			}
			else {
				if (this.imgBase64)
					this.formControl.setValue(this.imgBase64);
			}
		}, 1500);
	}




	removeItem(i)
	{

		this.imgUrlList.splice(i, 1);

		console.log('imgUrlList ',this.imgUrlList)
	}
}
