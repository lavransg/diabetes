import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { ResultsService } from '../results.service';
import { saveAs } from 'file-saver';
import questions from '../../assets/questions3.json';
import weights from '../../assets/weights.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  questionsFileName = "Choose a questions JSON file";
  weightsFileName = "Choose a weights JSON file";
  hasQuestions = false;
  hasWeights = false;

  constructor(private questionService: QuestionService, private resultsService: ResultsService) { }

  ngOnInit() {
    if (this.questionService.questions[0]) {
      this.hasQuestions = true;
    }
  }

  questionsFileAdded(event) {
    const filereader = new FileReader();
    if (event.target.files.length > 0) {
      filereader.onload = e => {
        console.log(filereader.result);
        const obj = JSON.parse(filereader.result as string);
        console.log(obj);
        this.questionService.questions = obj.questions;
        this.hasQuestions = true;
      };
      this.questionsFileName = event.target.files[0].name;
      filereader.readAsText(event.target.files[0]);
    }
  }

/*   saveQuestionsTemplate() {
    const fileData = JSON.stringify(questions, undefined, 0);
    const blob = new Blob([fileData], { type: "text/json;charset=utf-8" });
    saveAs(blob, "questions3.json");
  } */


}
