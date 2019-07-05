import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResultsService } from '../results.service';
import { HealthTestsService } from '../health-tests.service';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit, AfterViewInit {

  saveReportFile = false;
  saveTestFile = false;
  inputID = "Identifikator";
  selectedHealthAlternatives: any[] = [];

  constructor(private healthTestsService: HealthTestsService, private resultsService: ResultsService) {

  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.resultsService.result) {
      this.calculateRelativeResult();
      if (this.resultsService.completedHealthAnswers) {
        this.selectedHealthAlternatives = this.resultsService.completedHealthAnswers;
      }
    }
  }

  saveFiles() {
    if (this.saveReportFile) {
      this.resultsService.saveReport(this.inputID);
    }
    if (this.saveTestFile) {
      this.resultsService.saveTest(this.inputID);
    }
  }

  radioSelected(testID, alternativeID,value?) {
    let selection = this.selectedHealthAlternatives.find( element => element.testID === testID);
    if (selection) {
      if (value) {selection["value"] = value;}
      else {
        selection["testID"] = testID;
        selection["alternativeID"] = alternativeID;
      }
    }
    else {
      if (value) { this.selectedHealthAlternatives.push({testID, alternativeID, value}); }
      else {this.selectedHealthAlternatives.push({testID, alternativeID});}
    }
  }

  isRadioSelected(testID, alternativeID) {
    if (this.resultsService.completedHealthAnswers && this.resultsService.completedHealthAnswers.find(
      element => element.testID === testID && element.alternativeID === alternativeID)
    ) { return true; }
    return false;
  }

  saveHealthWeights() {
    this.resultsService.getHealthResults(this.selectedHealthAlternatives);
    if (this.resultsService.result) {
      this.calculateRelativeResult();
    }
  }

  // this function is used for making ratios for a bar graphs heights.
  // the tallest bar has value 1, while all other bars are the fraction of points that category has compared to the max
  // these values are used to calculate height in pixels
  calculateRelativeResult() {
    const result = this.resultsService.result;
    const healthResult = this.resultsService.healthResult;
    const highestCategory = this.resultsService.highestCategory;
    const highestValue = this.resultsService.totalResult[highestCategory];
    const relativeResult = [];
    const relativeHealthResult = [];
    console.log(this.resultsService.maxPossibleResult)
    console.log(result)
    for (const [index,value] of result.entries()) {
      relativeResult.push(Math.round((value / this.resultsService.maxPossibleResult[index]) * 100));
    }
    console.log("relativeResult",relativeResult)
    const bars = document.getElementsByClassName("bar");
    console.log(bars)
    Array.from(bars).forEach((x: HTMLElement, index) => {
      console.log("setting bar ",index," to ", relativeResult[index]);
      x.style.height = `${(relativeResult[index] * 3)}px`;
    });

    if (healthResult) {
      console.log("healthResult:",healthResult)
      for (const [index,value] of healthResult.entries()) {
        relativeHealthResult.push(Math.round((value / this.resultsService.maxPossibleResult[index]) * 100));
      }
      console.log(relativeHealthResult)
      const barsHealth = document.getElementsByClassName("bar-health");
      Array.from(barsHealth).forEach((x: HTMLElement, index) => x.style.height = `${(relativeHealthResult[index] * 3)}px`);
      Array.from(bars).forEach((x: HTMLElement, index) => x.style.borderRadius = "0 0 4px 4px");
    }

  }

}
