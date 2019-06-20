import { Injectable } from '@angular/core';
import questions3 from '../assets/questions3.json';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  public questions: any[] = questions3.questions;
  questionIndex = 0;

  constructor() { }

  getNextQuestion() {
    return this.questions[this.questionIndex++];
  }

  isComplete() {
    return this.questionIndex === this.questions.length;
  }

  endSurvey() {
    this.questionIndex = 0;
  }
}
