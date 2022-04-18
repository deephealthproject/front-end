import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { InteractionService } from '../../services/interaction.service';
import { DataService } from '../../services/data.service';

export interface OutputDetailsData {
  dialogTitle: string;
  dialogContent;
  processId: string;
}

@Component({
  selector: 'app-show-output-details-dialog',
  templateUrl: './show-output-details-dialog.component.html',
  styleUrls: ['./show-output-details-dialog.component.css']
})
export class ShowOutputDetailsDialogComponent implements OnInit {

  dialogTitle: string;
  dialogContent;
  processId: string;
  imageSrc: string;
  classes;

  constructor(public dialogRef: MatDialogRef<ShowOutputDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OutputDetailsData, public translate: TranslateService, public _interactionService: InteractionService, private _dataService: DataService) {
    this.dialogTitle = data.dialogTitle;
    this.dialogContent = data.dialogContent;
    this.processId = data.processId;
    this.imageSrc = this.dialogContent.outputImagePreview;
    this.classes = this.dialogContent.outputDetails;
  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }

}
