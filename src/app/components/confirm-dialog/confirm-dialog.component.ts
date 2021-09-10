import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { InteractionService } from '../../services/interaction.service';

export interface DialogData {
  dialogTitle: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  dialogTitle: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public _interactionService: InteractionService,
    public translate: TranslateService,
    private router: Router) {
    this.dialogTitle = data.dialogTitle;
  }

  save() {
    this._interactionService.userLoggedOut = false;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/']);
    this.dialogRef.close(this.data);
  }

}
