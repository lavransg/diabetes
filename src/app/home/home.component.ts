import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  filename = "Choose a JSON file";

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
  }

  fileAdded(event) {
    const filereader = new FileReader();
    if (event.target.files.length > 0) {
      filereader.onload = e => {
        console.log(e.target.result);
        const obj = JSON.parse(e.target.result);
        console.log(obj);
        this.questionService.questions = obj.questions;
      };
      this.filename = event.target.files[0].name;
      filereader.readAsText(event.target.files[0]);
    }
  }

}
