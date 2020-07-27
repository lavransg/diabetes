import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { ResultsService } from '../results.service';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  nextQuestion: any;
  answers: any[] = [];
  inputValue = "";

  constructor(public questionService: QuestionService, public resultsService: ResultsService, private router: Router) { }

  ngOnInit() {
    this.nextQuestion = this.questionService.getNextQuestion();
  }

  next(questionID, alternativeID, value?) {
    if (value){ this.answers.push({questionID, alternativeID, value}); }
    else      { this.answers.push({questionID, alternativeID}); }
    if (this.questionService.isComplete()) {
      this.endSurvey()
      return;
    }
    for ( let alternative of this.nextQuestion.alternatives) {
      if ('skip' in alternative && alternative.id == alternativeID) {
        this.questionService.skipQuestions(alternative.skip)
      }
    }
    this.nextQuestion = this.questionService.getNextQuestion();
    // in case the last question should be skipped, and nextquestion therefore returns nothing, end the survey
    if (this.nextQuestion == undefined){
      this.endSurvey()
    }
    this.inputValue = "";
    console.log(this.answers)
  }

  endSurvey(){
    this.questionService.endSurvey();
    this.resultsService.completedAnswers = this.answers;
    this.resultsService.getResults(this.answers);
    this.router.navigate(["/complete"]);
  }

}
