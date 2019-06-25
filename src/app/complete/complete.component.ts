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

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.resultsService.result) {
      this.calculateRelativeResult();
    }
  }

  // this function is used for making multipliers for a bar graphs height.
  // the tallest bar has value 1, while all other bars are the fraction of points that category has compared to the max
  calculateRelativeResult() {
    const result = this.resultsService.result;
    const highestCategory = this.resultsService.highestCategory;
    const highestValue = result[highestCategory];
    const relativeResult = [];
    for (const value of result) {
      relativeResult.push(Math.round((value  / highestValue) * 100) / 100);
    }

    const bars = document.getElementsByClassName("bar");
    console.log("bars:", bars);

    Array.from(bars).forEach((x: HTMLElement, index) => x.style.height = `${100 + (relativeResult[index] * 250)}px`);

    console.log(relativeResult);
  }

}
