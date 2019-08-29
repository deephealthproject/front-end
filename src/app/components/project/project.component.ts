import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  selectedPreTraining = 'option1';
  selectedFineTuning = 'option1';
  selectedInputSize = 'option1';
  selectedLoss = 'option1';
  fileTempLocation: string;

  public message: string;

  constructor(public _interactionService: InteractionService, private dataService: DataService) { }

  ngOnInit() {

  }

  BrowseProjectImage(event: any) {
    this._interactionService.projectInputFiles = event.target.files;
    this.fileTempLocation = event.target.value;
    if (this._interactionService.projectInputFiles.length === 0)
      return;
    var fileInput = this._interactionService.projectInputFiles[0].type;

    var reader = new FileReader();
    this._interactionService.projectImagePathSource = this._interactionService.projectInputFiles;
    reader.readAsDataURL(this._interactionService.projectInputFiles[0]);
    reader.onload = () => {
      this._interactionService.projectImageURLSource = reader.result;
    }
  }

  saveProjectImage() {
    this.dataService.processImage(this.fileTempLocation).subscribe(data => {
      // TODO: de afisat continutul obiectului json primit
      console.log(data.body);
    });

  }
}
