import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  objectKeys = Object.keys
  data: any[];
  constructor(private questionService: QuestionService) {
  }

  ngOnInit() {
    if (this.questionService.data) { this.data = this.questionService.data; }
  }

}
