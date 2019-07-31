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

  editQuestionAlternativeWeight(questionID,alternativeID,index,value){
    let question = this.originalData["questions"].find(question => question.id == questionID)
    let alternative = question.alternatives.find(alternative => alternative.id == alternativeID)
    alternative.weights[index] = parseInt(value)

    let question2 = this.data["questions"].find(question => question.id == questionID)
    let alternative2 = question2.alternatives.find(alternative => alternative.id == alternativeID)
    alternative2.weights[index] = parseInt(value)

    console.log(this.originalData)
  }

  editTestAlternativeWeight(testID,alternativeID,index,value){
    let test = this.originalData["tests"].find(test => test.id == testID)
    let alternative = test.alternatives.find(alternative => alternative.id == testID)
    alternative.weights[index] = parseInt(value)

    let test2 = this.data["tests"].find(test => test.id == testID)
    let alternative2 = test2.alternatives.find(alternative => alternative.id == alternativeID)
    alternative2.weights[index] = parseInt(value)

    console.log(this.originalData)
  }

}
