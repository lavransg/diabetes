import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  questionsFileName = "Velg en JSON-fil for spørsmål";
  hasQuestions = false;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    if (this.questionService.questions[0]) {
      this.hasQuestions = true;
    }
  }

  questionsFileAdded(event) {
    const filereader = new FileReader();
    if (event.target.files.length > 0) {
      filereader.onload = e => {
        const obj = JSON.parse(filereader.result as string);
        console.log(obj);
        this.questionService.questions = obj.questions;
        this.hasQuestions = true;
      };
      this.questionsFileName = event.target.files[0].name;
      filereader.readAsText(event.target.files[0]);
    }
  }

}
