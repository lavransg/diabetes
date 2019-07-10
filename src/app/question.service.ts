import { Injectable } from '@angular/core';
import questions from '../assets/questions4.json';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  public questions: any[] = questions.questions;
  public categories: any[] = questions.categories;
  public colors: number[] = questions.colors;
  public actions: any[] = questions.actions;
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
