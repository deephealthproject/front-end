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

  classificationIsClicked = true;
  userScreenIsClicked = false;
  networkStatisticsIsClicked = false;

  divMiddleShowStatus = true;
  divLeftShowStatus = true;
  divUserScreenShowStatus = false;
  divNetworkStatisticsShowStatus = false;

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
    event.srcElement.value = null;
  }

  processImage() {
    this.dataService.processImage(this.fileTempLocation).subscribe(data => {
      // TODO: de afisat continutul obiectului json primit
      console.log(data.body);
    });
  }

  openConfiguration() {
    this.divLeftShowStatus=true;
    this.divMiddleShowStatus=true;
    this.divUserScreenShowStatus=false;
    this.classificationIsClicked=true;
    this.userScreenIsClicked=false;
    this.networkStatisticsIsClicked=false;
    this.divNetworkStatisticsShowStatus=false;
  }

  openUserScreen() {
    this.divLeftShowStatus=false;
    this.divMiddleShowStatus=false;
    this.divNetworkStatisticsShowStatus=false;
    this.divUserScreenShowStatus=true;
    this.classificationIsClicked=false;
    this.networkStatisticsIsClicked=false;
    this.userScreenIsClicked=true;
  }

  openNetworkStatistics() {
    this.divLeftShowStatus=false;
    this.divMiddleShowStatus=false;
    this.divUserScreenShowStatus=false;
    this.classificationIsClicked=false;
    this.userScreenIsClicked=false;
    this.networkStatisticsIsClicked=true;
    this.divNetworkStatisticsShowStatus=true;
  }
}
