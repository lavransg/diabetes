import { Injectable } from '@angular/core';
import { QuestionService } from './question.service';
import { HealthTestsService } from './health-tests.service';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  completedAnswers: any[]; // question id's + selected alternative id's for survey questions
  completedHealthAnswers: any[]; // question id's + selected alternative id's for health variables
  result: number[]; // final calculated weights from questions
  healthResult: number[]; // final calculated weights from tests
  totalResult: number[] = []; // final calculated weights from questions and tests
  highestCategory: number;
  categories = this.questionService.categories;

  constructor(private questionService: QuestionService, private healthTestsService: HealthTestsService) {}

  // calculates the result weights of the survey answers
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

  // calculates the result weights of the health-values
  getHealthResults(answers: object[]) {
    this.completedHealthAnswers = answers;
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
    this.calculateTotalResult();

  }

  // calculates the result weights of both survey answers and the health-values
  calculateTotalResult() {
    this.totalResult = [];
    if (this.result) {
      for (const [index, value] of this.result.entries()) {
        if (this.healthResult) {
          this.totalResult.push(value + this.healthResult[index]);
        } else {this.totalResult = this.result; }
      }
    }

    this.highestCategory = this.totalResult.indexOf(Math.max.apply(null, this.totalResult));
  }

  // produces a text string with each survey question + selected answer
  // used when saving a report text file on the users machine
  generateReport() {
    if (!this.result) { return null; }
    let text = "";

    // printing each category and its calculated result value
    for (const [index, category] of this.categories.entries()) {
      text += category + ": " + this.result[index] + " \n";
    }
    text += "\n";

    // finding survey question text and selected answer text
    for (const answer of this.completedAnswers) {
      let questionID = "questionID"
      let alternativeID = "alternativeID"
      let value = "value"
      const question = this.questionService.questions.find(element => element.id === answer[questionID]);
      for (const alternative of question.alternatives) {
        if (alternative.id === answer[alternativeID]) {
          if (answer["value"]){
            text += question.question + "\n" + "Svar: " + answer[value] + " " + alternative.text + "\n\n";
          }
          else {
            text += question.question + "\n" + "Svar: " + alternative.text + "\n\n";
          }
        }
      }
    }

    // finding health-values text and selected answer text
    if (this.completedHealthAnswers) {
      text += "\n\nFysiologiske helseverdier:\n\n"
      for (const answer of this.completedHealthAnswers) {
        const testID = "testID";
        const alternativeID = "alternativeID";
        const test = this.healthTestsService.healthTests.find(element => element.id === answer[testID]);
        for (const alternative of test.weights) {
          if (alternative.id === answer[alternativeID]) {
            text += test.test + "\n" + "Svar: " + alternative.text + "\n\n";
          }
        }
      }
    }

    console.log(text);
    return text;

  }

  // saves a text file with all results + answers to the users machine.
  saveReport(id) {
    let report = this.generateReport();
    console.log(report)
    let filename = new Date().toUTCString().slice(5, -13) + "-" + id + ".txt";
    if (report) {
      report.replace(/\n/g, "\r\n");
      const blob = new Blob([report], {type: "text/plain", endings:'native'});
      FileSaver.saveAs(blob, filename);
    }
  }

  // saves a JSON-file with question and answer id-pairs so that a survey can be re-run from this local file
  saveTest(id) {
    let filename = new Date().toUTCString().slice(5, -13) + "-" + id + ".json";

    if (this.completedAnswers && !this.completedHealthAnswers) {
      const json = JSON.stringify({questions: this.completedAnswers});
      const blob = new Blob([json], {type: "application/json"});
      FileSaver.saveAs(blob, filename);
    }
    else if (this.completedAnswers && this.completedHealthAnswers) {
      const json = JSON.stringify({questions: this.completedAnswers, tests: this.completedHealthAnswers});
      const blob = new Blob([json], {type: "application/json"});
      FileSaver.saveAs(blob, filename);
    }

  }

  clearResults(){
    this.completedAnswers = undefined;
    this.completedHealthAnswers = undefined;
    this.result = undefined;
    this.healthResult = undefined;
    this.totalResult = [];
    this.highestCategory = undefined;
    this.questionService.endSurvey();
  }

}
