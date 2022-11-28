
import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ControlContainer, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileResult } from '../../../core/models/fileResult';

@Component({
	selector: 'doko-file-upload-all',
	templateUrl: './file-upload-all.component.html',
	styleUrls: ['./file-upload-all.component.scss'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => FileUploadAllComponent),
		multi: true
	}],
	viewProviders: [
		{
			provide: ControlContainer,
			useExisting: FormGroupDirective
		}
	]
})

export class FileUploadAllComponent implements OnInit {

	public form!: FormGroup;
	public formControl!: FormControl;


	public fileUploadQueue: any;
	constructor(private controlContainer: ControlContainer,
		private cdr: ChangeDetectorRef,

	) { }

	@Input() controlName!: string;



	@Input() imgBase64: any;
	@Input() imgURL: any;
	@Input() multiple: boolean = true;
	@Input() height: any = "218px";


	resultFiles: FileResult[] = [];
	fileResult!: FileResult;
	@Output() files: EventEmitter<FileResult[]> = new EventEmitter();

	@Output() confirm: EventEmitter<any> = new EventEmitter();
	@Output() close: EventEmitter<any> = new EventEmitter();
	@Output() chance: EventEmitter<any> = new EventEmitter();

	@Input() isSaveButton: boolean = true;



	ngOnInit(): void {

		console.log('fileUploadComponent imgURL', this.imgURL);

		this.form = <FormGroup>this.controlContainer.control;
		this.formControl = <FormControl>this.form.get(this.controlName);

	}


	isFileControlHasError: boolean | undefined;
	uploadImage: any;

	onFileDragDrop1(FileList: any) {
		console.log('onFileDragDrop1', FileList.target.files)
		this.onFileDragDrop(FileList.target.files);

	}
	onFileDragDrop(FileList: any) {
		console.log('onFileDragDrop', FileList)

		//this.resultFiles = [];
		if (FileList && FileList[0]) {

			var dosyaSayisi = FileList.length


			if (!this.multiple) {
				dosyaSayisi = 1;
			}


			for (let i = 0; i < dosyaSayisi; i++) {
				const reader = new FileReader();

				let fileResult = new FileResult();
				let file = FileList[i];

				fileResult.description = file.name;
				fileResult.file_ext = file.type.split("/")[1];
				console.log('file ', file)
				console.log('fileResult', this.fileResult)

				if (!file.name.match(/(\.jpg|\.png|\.JPG|\.PNG|\.jpeg|\.pdf|\.xls|\.doc|\.docx|\.xlsx|\.JPEG)$/)) {
					this.isFileControlHasError = true;
				}
				else {
					if (file.size > 10024 * 1024 * 1) {
						this.isFileControlHasError = true;
					} else {
						this.isFileControlHasError = false;
						reader.readAsDataURL(file);
						reader.onload = () => {
							fileResult.file_data = reader.result;
							this.resultFiles.push(fileResult);
							this.chance.emit(true);

							console.log('this.imgUrlList', this.resultFiles)
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
			if (this.resultFiles.length) {
				this.formControl.setValue(this.resultFiles[0].file_data);
				this.formControl.markAsDirty();
				console.log('Belge yüklemesi', this.form.value);
			} else {
				if (this.imgBase64)
					this.formControl.setValue(this.imgBase64);
			}
		}, 1500);
	}



	save() {

		this.files.emit(this.resultFiles);
		if (this.multiple)
			this.confirm.emit(this.resultFiles);
		else
			this.confirm.emit(this.resultFiles[0]);

	}

	removeItem(i?: any) {
		console.log('removeItem', this.resultFiles);
		if (i) {
			this.resultFiles.splice(i, 1);
		} else {
			this.resultFiles.splice(0, 1);
		}
		this.formControl.setValue("");
		console.log('removeItem form', this.form);
		console.log('imgUrlList ', this.resultFiles)
	}
}
