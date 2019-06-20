import { Injectable } from '@angular/core';
import { QuestionService } from './question.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  result: number[];
  highestCategory: number;
  categories = this.questionService.categories;

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

}
