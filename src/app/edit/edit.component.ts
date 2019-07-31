import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';

export class Node {
  children: Node[];
}
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  originalData = this.questionService.data;
  data = JSON.parse(JSON.stringify(this.questionService.data));

  constructor(private questionService: QuestionService) {
  }

  ngOnInit() {
    if (this.questionService.data) {
      /* this.data = this.questionService.data; */
    }
  }

}
