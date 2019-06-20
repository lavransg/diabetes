import { Injectable } from '@angular/core';
import { QuestionService } from './question.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  result: number[];
  categories = this.questionService.categories;

  constructor(private questionService: QuestionService) {}

  getResults(answers: object[]) {
    const result = new Array(this.categories.length).fill(0);
    for (const answer of answers) {
      const quesionID = "questionID";
      const question = this.questionService.questions.find(element => element.id === answer[quesionID]);
      for (const alternative of question.alternatives) {
        for (const [index, weight] of alternative.weights.entries()) {
          if (weight) {
            result[index] += weight;
          }
        }
      }
    }
    this.result = result;
  }

}
