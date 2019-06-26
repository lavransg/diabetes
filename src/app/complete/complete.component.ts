import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResultsService } from '../results.service';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit, AfterViewInit {

  relativeResult: number[];

  constructor(private resultsService: ResultsService) {

  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.resultsService.result) {
      this.calculateRelativeResult();
    }
  }



  // this function is used for making ratios for a bar graphs height.
  // the tallest bar has value 1, while all other bars are the fraction of points that category has compared to the max
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
    }
  }

}
