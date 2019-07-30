import { Injectable } from '@angular/core';
import data from '../assets/questions5.json';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  public questions: any[] = data.questions;
  public categories: any[] = data.categories;
  public colors: number[] = data.colors;
  public actions: any[] = data.actions;
  public healthTests: any[] = data.tests;
  public data: any[] = data;

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
