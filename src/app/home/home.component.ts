import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { HealthTestsService } from '../health-tests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  questionsFileName = "Last opp JSON-fil med spørsmål og vekter";
  uploaded = false;
  hasQuestions = false;
  healthTests: any;

  constructor(private questionService: QuestionService, private healthTestsService: HealthTestsService) { }

  ngOnInit() {
    if (this.questionService.questions[0]) {
      this.hasQuestions = true;
    }
    if (this.healthTestsService.HealthTests) {
      this.healthTests = this.healthTestsService.HealthTests;
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
        this.uploaded = true;
      };
      this.questionsFileName = event.target.files[0].name;
      filereader.readAsText(event.target.files[0]);
    }
  }

}
