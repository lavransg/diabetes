import { Injectable } from '@angular/core';
// import data from '../assets/questions.json';
// const data = require('../assets/questions.json');

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  questions: any[] = [
    {question: "question1", alternatives: ["alternative1", "alternative2"]},
    {question: "question2", alternatives: ["alternative1", "alternative2"]},
    {question: "question3", alternatives: ["alternative1", "alternative2"]},
    {question: "question4", alternatives: ["alternative1", "alternative2"]},
    {question: "question5", alternatives: ["alternative1", "alternative2"]}
  ];

  questionIndex = 0;

  constructor() { }

  getNextQuestion() {
    return this.questions[this.questionIndex++];
  }

  isComplete() {
    return this.questionIndex === this.questions.length - 1;
  }

  endSurvey() {
    this.questionIndex = 0;
  }
}
