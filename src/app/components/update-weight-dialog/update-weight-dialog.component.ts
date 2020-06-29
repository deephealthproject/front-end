import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../node_modules/@angular/material';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { InteractionService } from '../../services/interaction.service';
import { DataService } from '../../services/data.service';

export interface UpdateWeightData {
  dialogTitle: string;
  dialogContent: string;
  inputValue: string;
}

@Component({
  selector: 'app-update-weight-dialog',
  templateUrl: './update-weight-dialog.component.html',
  styleUrls: ['./update-weight-dialog.component.css']
})

export class UpdateWeightDialogComponent implements OnInit {
  dialogTitle: string;
  dialogContent: string;
  formDataWeight;

  constructor(public dialogRef: MatDialogRef<UpdateWeightDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateWeightData, public translate: TranslateService, public _interactionService: InteractionService, private _dataService: DataService) {
    this.dialogTitle = data.dialogTitle;
    this.dialogContent = data.dialogContent;
  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.data.inputValue = this._interactionService.formDataWeight.name;
    this.dialogRef.close(this.data); 
  }
  

}
