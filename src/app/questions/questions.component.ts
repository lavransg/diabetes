import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  nextQuestion: any;
  complete = false;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.nextQuestion = this.questionService.getNextQuestion();
  }

  next() {
    this.complete = this.questionService.isComplete();
    this.nextQuestion = this.questionService.getNextQuestion();
  }

}
