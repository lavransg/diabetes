import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { HealthTestsService } from '../health-tests.service';
import { ResultsService } from '../results.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  questionsFileName = "Last opp JSON-fil med spørsmål og vekter";
  completedTestFileName = "Last opp JSON-fil med fullført test";
  questionsUploaded = false;
  completedTestUploaded = false;
  hasQuestions = false;
  healthTests: any;
  selectedHealthAlternatives: any[] = [];

  constructor(
    private questionService: QuestionService,
    private healthTestsService: HealthTestsService,
    private resultsService: ResultsService
  ) { }

  ngOnInit() {
    this.resultsService.clearResults();
    this.selectedHealthAlternatives = [];
    if (this.questionService.questions[0]) { this.hasQuestions = true; }
    if (this.healthTestsService.healthTests) { this.healthTests = this.healthTestsService.healthTests; }
  }

  questionsFileAdded(event) {
    const filereader = new FileReader();
    if (event.target.files.length > 0) {
      filereader.onload = e => {
        const obj = JSON.parse(filereader.result as string);
        this.questionService.questions = obj.questions;
        this.hasQuestions = true;
        this.questionsUploaded = true;
      };
      this.questionsFileName = event.target.files[0].name;
      filereader.readAsText(event.target.files[0]);
    }
  }

  completedTestFileAdded(event) {
    const filereader = new FileReader();
    if (event.target.files.length > 0) {
      filereader.onload = e => {
        const obj = JSON.parse(filereader.result as string);
        this.resultsService.completedAnswers = obj.questions;
        this.hasQuestions = true;
        if (obj.tests) {
          this.resultsService.getHealthResults(obj.tests);
          this.selectedHealthAlternatives = this.resultsService.completedHealthAnswers;
        }
        this.completedTestUploaded = true;
      };
      this.completedTestFileName = event.target.files[0].name;
      filereader.readAsText(event.target.files[0]);
    }
  }

  showUploadedTest() {
    this.resultsService.getResults(this.resultsService.completedAnswers);
  }

  radioSelected(testID, alternativeID) {
    const filtered = this.selectedHealthAlternatives.filter(element => element.testID !== testID); // removes element with same testID
    filtered.push({testID, alternativeID});
    this.selectedHealthAlternatives = filtered;
  }

  isRadioSelected(testID, alternativeID) {
    if (this.selectedHealthAlternatives.find( element => element.testID === testID && element.alternativeID === alternativeID)
    ) { return true; }
    return false;
  }

  saveHealthWeights() {
    this.resultsService.getHealthResults(this.selectedHealthAlternatives);
  }

}
