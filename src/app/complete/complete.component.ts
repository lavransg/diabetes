import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../results.service';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit {

  result: number[];

  constructor(private resultsService: ResultsService) {

  }

  ngOnInit() {
  }

}
