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

  public skip: any[] = new Array(this.questions.length).fill(false)

  questionIndex = 0;

  constructor() { }

  getNextQuestion() {

    if (this.skip[this.questionIndex + 1]){
      // find next non-skip question
      for (let i = this.questionIndex + 2; i < this.questions.length; i++){
        if (!this.skip[i]){
          this.questionIndex = i + 1
          return this.questions[i]
        }
      }
    }

    else {
      let question = this.questions[this.questionIndex]
      this.questionIndex++
      return question
    }

  }

  isComplete() {
    return this.questionIndex >= this.questions.length;
  }

  endSurvey() {
    this.skip = new Array(this.questions.length).fill(false)
    this.questionIndex = 0;
  }

  // takes in an array of question IDs that should be skipped or a range where all questions in it are skipped
  skipQuestions(skips: any[]){

    // if the first entry in the skips array is a range ('x-y')
    if (skips[0] && (typeof skips[0] === 'string' || skips[0] instanceof String) && skips[0].includes("-")){
      let startStop = skips[0].split("-")
      startStop[0] = Number(startStop[0])
      startStop[1] = Number(startStop[1])

      this.questions.forEach( (question, index) => {
        if (Number(question.id) >= startStop[0] && Number(question.id) <= startStop[1]){
          this.skip[index] = true
        }
      })

    }

    else {
      for (let skip of skips){
        let index = this.questions.findIndex( item => skip == item.id)
        if (index != -1){ this.skip[index] = true}
      }
    }

  }
}
