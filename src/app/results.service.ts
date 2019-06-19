import { Injectable } from '@angular/core';
import { QuestionService } from './question.service';
import weights2 from '../assets/weights2.json';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  result: number[];
  categories = [
    "Forbedre motivasjon",
    "forbedre mental helse",
    "behov for oppfølging",
    "forbedre trening",
    "mulighet for avstandsoppfølging",
    "forbedre ernæring",
    "ikke aktuell"
  ];
  numQuestions: number;

  weightMatrix: any[] = weights2.weights;

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
  }

  getResults(answers: number[]) {
    const result = new Array(this.categories.length).fill(0);
    for (let i = 0; i < answers.length; i++) {
      for (let j = 0; j < this.weightMatrix[i].length; j++) {
        if (this.weightMatrix[i][j][answers[i] - 1]) {
          result[j] += this.weightMatrix[i][j][answers[i] - 1];
        } else { result[j] += 0; }
      }
    }
    this.result = result;
  }

}
