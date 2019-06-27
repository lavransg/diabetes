import { Injectable } from '@angular/core';
import { QuestionService } from './question.service';
import { HealthTestsService } from './health-tests.service';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  completedAnswers: any[]; // question id's + selected alternative id's
  result: number[]; // final calculated weights from questions
  healthResult: number[]; // final calculated weights from tests
  totalResult: number[] = []; // final calculated weights from questions and tests
  highestCategory: number;
  categories = this.questionService.categories;
  report: string;

  constructor(private questionService: QuestionService, private healthTestsService: HealthTestsService) {}

  getResults(answers: object[]) {
    const result = new Array(this.categories.length).fill(0);
    for (const answer of answers) {
      const quesionID = "questionID";
      const alternativeID = "alternativeID";
      const question = this.questionService.questions.find(element => element.id === answer[quesionID]);
      for (const alternative of question.alternatives) {
        if (alternative.id === answer[alternativeID]) {
          for (const [index, weight] of alternative.weights.entries()) {
            result[index] += weight;
          }
        }
      }
    }
    this.result = result;
    this.calculateTotalResult();
  }

  getHealthResults(answers: object[]) {
    const result = new Array(this.categories.length).fill(0);
    for (const answer of answers) {
      const testID = "testID";
      const alternativeID = "alternativeID";
      const test = this.healthTestsService.healthTests.find(element => element.id === answer[testID]);
      for (const alternative of test.weights) {
        if (alternative.id === answer[alternativeID]) {
          for (const [index, weight] of alternative.weight.entries()) {
            result[index] += weight;
          }
        }
      }
    }
    this.healthResult = result;

  }

  calculateTotalResult() {
    for (const [index, value] of this.result.entries()) {
      if (this.healthResult) {
        this.totalResult.push(value + this.healthResult[index]);
      } else {this.totalResult = this.result; }
    }
    this.highestCategory = this.totalResult.indexOf(Math.max.apply(null, this.totalResult));
  }

  generateReport(answers: object[]) {
    if (!this.result) { return null; }
    let text = "";

    for (const [index, category] of this.categories.entries()) {
      text += category + " " + this.result[index] + " \n";
    }
    text += "\n";

    for (const answer of answers) {
      const quesionID = "questionID";
      const alternativeID = "alternativeID";
      const question = this.questionService.questions.find(element => element.id === answer[quesionID]);
      for (const alternative of question.alternatives) {
        if (alternative.id === answer[alternativeID]) {
          text += question.question + "\n" + "Svar: " + alternative.text + "\n\n";
        }
      }
    }

    this.report = text;
    console.log(text);

  }

  saveReport(id) {
    let filename = "";
    filename += new Date().toUTCString().slice(6, -13);
    filename += "-" + id + ".txt";
    if (this.report) {
      const report = this.report.replace(/\n/g, "\r\n");
      const blob = new Blob([report], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, filename);
    }
  }

  saveTest(id) {
    if (this.completedAnswers) {
      let filename = "";
      filename += new Date().toUTCString().slice(6, -13);
      filename += "-" + id + ".json";
      const json = JSON.stringify(this.completedAnswers);
      const blob = new Blob([json], {type: "application/json"});
      FileSaver.saveAs(blob, filename);
    }

  }

  clearResults(){
    this.completedAnswers = undefined;
    this.result = undefined;
    this.healthResult = undefined;
    this.totalResult = undefined;
    this.highestCategory = undefined;
    this.report = undefined;
    this.questionService.endSurvey();
  }

}
