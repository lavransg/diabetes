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
    else { this.answers.push({questionID, alternativeID}); }
    if (this.questionService.isComplete()) {
      this.questionService.endSurvey();
      this.resultsService.completedAnswers = this.answers;
      this.resultsService.getResults(this.answers);
      this.router.navigate(["/complete"]);
      return;
    }
    this.nextQuestion = this.questionService.getNextQuestion();
    this.inputValue = "";
    console.log(this.answers)
  }

}
