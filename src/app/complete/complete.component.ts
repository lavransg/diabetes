import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResultsService } from '../results.service';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit, AfterViewInit {

  saveReportFile = false;
  saveTestFile = false;
  inputID = "Identifikator";

  constructor(private resultsService: ResultsService) {

  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.resultsService.result) {
      this.calculateRelativeResult();
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

    for (const value of result) {
      relativeResult.push(Math.round((value  / highestValue) * 100) / 100);
    }
    const bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach((x: HTMLElement, index) => x.style.height = `${(relativeResult[index] * 300)}px`);

    if (healthResult) {
      for (const value of healthResult) {
        relativeHealthResult.push(Math.round((value  / highestValue) * 100) / 100);
      }
      const barsHealth = document.getElementsByClassName("bar-health");
      Array.from(barsHealth).forEach((x: HTMLElement, index) => x.style.height = `${(relativeHealthResult[index] * 300)}px`);
      Array.from(bars).forEach((x: HTMLElement, index) => x.style.borderRadius = "0 0 4px 4px");
    }

  }

}
