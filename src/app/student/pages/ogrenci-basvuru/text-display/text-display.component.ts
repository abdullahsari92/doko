import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'kt-text-display',
  templateUrl: './text-display.component.html',
  styleUrls: ['./text-display.component.scss']
})
export class TextDisplayComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TextDisplayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    console.log('data', this.data);
  }
  ss() {
    this.dialogRef.close();
  }
  bildirimOnayla(bildirim_id:number) {
    this.dialogRef.close({'id': bildirim_id, 'onay': 1});
  }
}
