import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResultsService } from '../results.service';
import { QuestionService } from '../question.service';
import { HealthTestsService } from '../health-tests.service';
@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements AfterViewInit {

  saveReportFile = false;
  saveTestFile = false;
  inputID = "Identifikator";
  selectedHealthAlternatives: any[] = [];
  colors: number[] = this.questionService.colors;
  actions: any[];

  constructor(
    private healthTestsService: HealthTestsService, // this is used in HTML by by the health test modal
    private resultsService: ResultsService,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.calculateActionResults();
  }

  ngAfterViewInit() {
    if (this.resultsService.result) {
      this.calculateRelativeResult();
      if (this.resultsService.completedHealthAnswers) {
        this.selectedHealthAlternatives = this.resultsService.completedHealthAnswers;
      }
    }
  }

  saveFiles() {
    if (this.saveReportFile) { this.resultsService.saveReport(this.inputID); }
    if (this.saveTestFile) { this.resultsService.saveTest(this.inputID); }
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
    this.calculateRelativeResult();
    this.calculateActionResults();
  }

  calculateActionResults() {
    if(this.questionService.actions && this.resultsService.totalResult){
      let actions = this.questionService.actions;
      const totalResult = this.resultsService.totalResult;
      for (let action of actions) {
        let sum = 0;
        for (let [index,weight] of action.weights.entries()) {
          sum += totalResult[index] * weight
        }
        if (sum > 100) {sum = 100}
        action["value"] = Math.round(sum);

        for (let subaction of action.subactions){
          let sum2 = 0;
          for (let [index,weight] of subaction.weights.entries()){
            sum2 += totalResult[index] * weight;
          }
          if (sum2 > 100) {sum = 100}
          subaction["value"] = Math.round(sum2);
        }
        action.subactions.sort(this.compareActions);
      }
      actions.sort(this.compareActions)
      this.actions = actions;
    }

  }

  compareActions(a,b) {
    if ( a.value > b.value ){return -1;}
    if ( a.value < b.value ){return 1;}
    return 0;
  }

  // this function is used for making ratios for a bar graphs heights.
  // the tallest bar has value 1, while all other bars are the fraction of points that category has compared to the max
  // these values are used to calculate height in pixels
  calculateRelativeResult() {
    const result = this.resultsService.result;
    const healthResult = this.resultsService.healthResult;
    const relativeResult = [];
    const relativeHealthResult = [];
    for (const [index,value] of result.entries()) {
      relativeResult.push(Math.round((value / this.resultsService.maxPossibleResult[index]) * 100));
    }
    let bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach((x: HTMLElement, index) => { x.style.height = `${(relativeResult[index] * 2.5)}px`;});

    if (healthResult) {
      for (const [index,value] of healthResult.entries()) {
        relativeHealthResult.push(Math.round((value / this.resultsService.maxPossibleResult[index]) * 100));
      }
      const barsHealth = document.getElementsByClassName("bar-health");
      Array.from(barsHealth).forEach((x: HTMLElement, index) => x.style.height = `${(relativeHealthResult[index] * 2.5)}px`);
      Array.from(bars).forEach((x: HTMLElement, index) => x.style.borderRadius = "0 0 4px 4px");
    }

  }

}
