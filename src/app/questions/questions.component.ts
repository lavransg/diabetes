import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  nextQuestion: any;
  answers: any[] = [];

  constructor(private questionService: QuestionService, private router: Router) { }

  ngOnInit() {
    this.nextQuestion = this.questionService.getNextQuestion();
  }

  next(alternativeID) {
    this.answers.push({question: this.nextQuestion.id, answer: alternativeID});
    if (this.questionService.isComplete()) {
      this.questionService.endSurvey();
      this.router.navigate(["/complete"]);
      console.log(this.answers);
      return;
    }
    this.nextQuestion = this.questionService.getNextQuestion();
  }

}
