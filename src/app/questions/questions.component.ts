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

  constructor(private questionService: QuestionService, private resultsService: ResultsService, private router: Router) { }

  ngOnInit() {
    this.nextQuestion = this.questionService.getNextQuestion();
  }

  next(questionID, alternativeID) {
    this.answers.push({questionID, alternativeID});
    if (this.questionService.isComplete()) {
      this.questionService.endSurvey();
      this.resultsService.getResults(this.answers);
      this.router.navigate(["/complete"]);
      this.resultsService.generateReport(this.answers);
      return;
    }
    this.nextQuestion = this.questionService.getNextQuestion();
  }

}
