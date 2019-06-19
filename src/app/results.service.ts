import { Injectable } from '@angular/core';
import { QuestionService } from './question.service';
import weights from '../../assets/weights.json';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  result: number[];
  numCategories = 6;
  numQuestions: number;
  maxAlternatives: number;

  weightMatrix: any[] = [];

/*   [
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
  ]; */

  constructor(private questionService: QuestionService) {

    this.numQuestions = questionService.questions.length;
    let max = 0;
    const qs = questionService.questions;
    for (const key in qs) {
      if (qs.length > max) {
        max = qs[key].alternatives.length;
      }
    }

  }

  getResults(answers: number[]) {
    const result = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < answers.length; i++) {
      for (let j = 0; j < this.weightMatrix[i].length; j++) {
        result[j] += this.weightMatrix[i][j][answers[i] - 1];
      }
    }
    this.result = result;
  }

}
