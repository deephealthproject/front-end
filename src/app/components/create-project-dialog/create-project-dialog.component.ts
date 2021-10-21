import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export interface DialogCreateProjectData {
  inputPlaceHolder: string;
  inputValue: string;
  dialogTitle: string;
  selectedOptionTask;
  taskDropdown: TaskProject[];
}

export interface TaskProject {
  id: string;
  name: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.css']
})
export class CreateProjectDialogComponent {
  inputPlaceHolder: string;
  inputValue: string;
  dialogTitle: string;
  selectedOptionTask: string;
  taskDropdown: TaskProject[];

  constructor(public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogCreateProjectData,
    public translate: TranslateService) {
    this.dialogTitle = data.dialogTitle;
    this.inputPlaceHolder = data.inputPlaceHolder;
    this.selectedOptionTask = data.selectedOptionTask;
    this.taskDropdown = [];
    let taskProject: TaskProject;
    data.taskDropdown.forEach(task => {
      taskProject = { id: task.id, name: task.name };
      this.taskDropdown.push(taskProject);
    });
  }

  save() {
    this.data.inputValue = this.inputValue;
    this.data.selectedOptionTask = this.selectedOptionTask;
    this.dialogRef.close(this.data);
  }

}
