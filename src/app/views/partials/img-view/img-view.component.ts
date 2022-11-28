import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-img-view',
  templateUrl: './img-view.component.html',
  styleUrls: ['./img-view.component.scss']
})
export class ImgViewComponent implements OnInit {

	@Input() imgURL: any;

	@Input() textTitle: any;


  constructor() { }

  ngOnInit(): void {
  }

}
