import { Injectable } from '@angular/core';
import { QuestionService } from './question.service';
import weights2 from '../assets/weights2.json';
import questions3 from '../assets/questions3.json';

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

  constructor(private questionService: QuestionService) {}

  getResults(answers: object[]) {
    const result = new Array(this.categories.length).fill(0);
    for (const answer of answers) {
      const quesionID = "questionID";
      const question = questions3.questions.find(element => element.id === answer[quesionID]);
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
