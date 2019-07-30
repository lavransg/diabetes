import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResultsService } from '../results.service';
import { QuestionService } from '../question.service';
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
    private resultsService: ResultsService,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.calculateActionResults();
  }

  ngAfterViewInit() {
    if (this.resultsService.result) {
      this.calculateBarHeights();
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
    this.calculateBarHeights();
    this.calculateActionResults();
  }

  calculateActionResults() {
    if(this.questionService.actions && this.resultsService.totalResult){
      let actions = this.questionService.actions;
      const totalResult = this.resultsService.totalResult;
      for (let action of actions) {

        let sum = 0;
        for (let [index,weight] of action.weights.entries()) { sum += totalResult[index] * weight;}
        if (sum > 100) {sum = 100}
        action["value"] = Math.round(sum);

        for (let subaction of action.subactions){
          let subsum = 0;
          for (let [index,weight] of subaction.weights.entries()){ subsum += totalResult[index] * weight;}
          if (subsum > 100) {subsum = 100}
          subaction["value"] = Math.round(subsum);
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

  calculateBarHeights() {
    const result = this.resultsService.result;
    const healthResult = this.resultsService.healthResult;
    const totalResult = this.resultsService.totalResult;
    let relativeResult = [];
    let relativeHealthResult = [];
    /* for (const [index,value] of result.entries()) {
      relativeResult.push(Math.round((value / this.resultsService.maxPossibleResult[index]) * 100));
    } */
    const bars = document.getElementsByClassName("bar");
    const barsHealth = document.getElementsByClassName("bar-health");

    if (healthResult) {
      for (const [index,value] of healthResult.entries()) {
        if (value + result[index] > 100) {
          relativeHealthResult.push(Math.round((value / (value + result[index])) * 100));
          relativeResult.push(Math.round((result[index] / (value + result[index])) * 100));
        }
        else{
          relativeHealthResult.push(value)
          relativeResult.push(result[index])
        }
      }
      Array.from(barsHealth).forEach((x: HTMLElement, index) => x.style.height = `${(relativeHealthResult[index] * 2.5)}px`);
      Array.from(bars).forEach((x: HTMLElement, index) => {
        x.style.height = `${(relativeResult[index] * 2.5)}px`;
        x.style.borderRadius = "0 0 4px 4px";
        if (healthResult[index] == 0){
          x.style.borderRadius = "4px 4px 4px 4px";
        }
      });
    }
    else{
      Array.from(bars).forEach((x: HTMLElement, index) => {
        x.style.height = `${(result[index] * 2.5)}px`;
        x.style.borderRadius = "4px 4px 4px 4px";
      });
    }

  }

}
