import { Injectable } from '@angular/core';
import { QuestionService } from './question.service';
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
  maxPossibleResult: number[] = []; // maximum possible result for each class
  highestCategory: number;
  categories = this.questionService.categories;

  constructor(private questionService: QuestionService) {}

  // calculates the result weights of the survey answers
  getResults(answers: object[]) {
    const result = new Array(this.categories.length).fill(0);
    for (const answer of answers) {
      const question = this.questionService.questions.find(element => element.id === answer["questionID"]);
      if (question){
        for (const alternative of question.alternatives) {
          if (alternative.id === answer["alternativeID"] && alternative.weights) {
            for (const [index, weight] of alternative.weights.entries()) {
              result[index] += Math.min(weight,100);
            }
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
      const test = this.questionService.healthTests.find(element => element.id === answer["testID"]);
      if (test){
        for (const alternative of test.alternatives) {
          if (alternative.id === answer["alternativeID"]) {
            for (const [index, weight] of alternative.weights.entries()) {
              result[index] += Math.min(weight,100);
            }
          }
        }
      }
    }
    this.healthResult = result;
    this.calculateTotalResult();
  }

  // calculates the result weights of both survey answers and the health-values
/*   calculateTotalResultOld() {
    this.totalResult = [];
    this.calculateMaxPossibleResult();
    if (this.result) {
      for (const [index, value] of this.result.entries()) {
        if (this.healthResult) {
          this.totalResult.push(Math.round(((value + this.healthResult[index]) / this.maxPossibleResult[index]) * 100));
        } else {
          this.totalResult.push(Math.round((value / this.maxPossibleResult[index]) * 100));
        }
      }
    }
    console.log("totalresult:",this.totalResult)
    this.highestCategory = this.totalResult.indexOf(Math.max.apply(null, this.totalResult));

  } */

  // this function should replace the one above when weights are changed to be between 0-100
  calculateTotalResult() {
    this.totalResult = [];
    if (this.result) {
      for (const [index, value] of this.result.entries()) {
        let categoryScore = this.healthResult ? Math.min(value + this.healthResult[index],100) : Math.min(value,100);
        this.totalResult.push(categoryScore);
      }
    }
    this.highestCategory = this.totalResult.indexOf(Math.max.apply(null, this.totalResult));
  }

/*   calculateMaxPossibleResult() {
    const max = new Array(this.categories.length).fill(0);

    // looping through questions
    for (const question of this.questionService.questions) {
      let qmax = new Array(this.categories.length).fill(0);
      for (let i = 0; i < this.categories.length; i++) {
        for (const alternative of question.alternatives) {
          if ( alternative.weights && alternative.weights[i] > qmax[i]) {
            qmax[i] = alternative.weights[i];
          }
        }
      }
      for (const [index,value] of qmax.entries()){
        max[index] += value;
      }
    }

    // looping through healthValues
    if (this.completedHealthAnswers) {
      for (const test of this.questionService.healthTests) {
        let tmax = new Array(this.categories.length).fill(0);
        for (let i = 0; i < this.categories.length; i++) {
          for (const alternative of test.alternatives) {
            if (alternative && alternative.weights[i] > tmax[i]) {
              tmax[i] = alternative.weights[i];
            }
          }
        }
        for (const [index,value] of tmax.entries()) {
          max[index] += value;
        }
      }
    }
    this.maxPossibleResult = max;
  } */

  // produces a text string with each survey question + selected answer
  // used when saving a report text file on the users machine
  generateReport() {
    if (!this.result) { return null; }
    let text = "";

    // printing each category and its calculated result value
    for (const [index, category] of this.categories.entries()) {
      text += category + ": " + this.totalResult[index] + "/100 \n";
    }
    text += "\n";

    // finding survey question text and selected answer text
    for (const answer of this.completedAnswers) {
      const question = this.questionService.questions.find(element => element.id === answer["questionID"]);
      for (const alternative of question.alternatives) {
        if (alternative.id === answer["alternativeID"]) {
          if (answer["value"]){
            text += question.question + "\n" + "Svar: " + answer["value"] + " " + alternative.text + "\n\n";
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
        const test = this.questionService.healthTests.find(element => element.id === answer["testID"]);
        for (const alternative of test.alternatives) {
          if (alternative.id === answer["alternativeID"]) {
            text += test.test + "\n" + "Svar: " + alternative.text;
            if (answer.value){
              text += "\nVerdi: " + answer.value;
            }
            text += "\n\n";
          }
        }
      }
    }

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
    this.maxPossibleResult = [];
    this.questionService.endSurvey();
  }

}
