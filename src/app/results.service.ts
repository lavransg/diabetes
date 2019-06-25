import { Injectable } from '@angular/core';
import { QuestionService } from './question.service';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  result: number[];
  highestCategory: number;
  categories = this.questionService.categories;
  report: string;

  constructor(private questionService: QuestionService) {}

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
    this.highestCategory = result.indexOf(Math.max.apply(null, result));
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

  saveReport() {
    let filename = "";
    filename += new Date().toUTCString().slice(6, -4);
    filename += ".txt";
    const report = this.report.replace(/\n/g, "\r\n");
    if (this.report) {
      const blob = new Blob([report], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, filename);
    }
  }

}
