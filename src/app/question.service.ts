import { Injectable } from '@angular/core';
import data from '../assets/questions.json';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  public questions: any[] = []; // data.questions;

  /*
  [
    {id: 1, question: "question1", alternatives: [{id: 1, text: "alternative1"}, {id: 2, text: "alternative2"}]},
    {id: 2, question: "question2", alternatives: [{id: 1, text: "alternative1"}, {id: 2, text: "alternative2"}]},
    {id: 3, question: "question3", alternatives: [{id: 1, text: "alternative1"}, {id: 2, text: "alternative2"}]},
    {id: 4, question: "question4", alternatives: [{id: 1, text: "alternative1"}, {id: 2, text: "alternative2"}]},
    {id: 5, question: "question5", alternatives: [{id: 1, text: "alternative1"}, {id: 2, text: "alternative2"}]}
  ];*/

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
