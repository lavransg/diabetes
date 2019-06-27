import { Injectable } from '@angular/core';
import data from '../assets/questions4.json';

@Injectable({
  providedIn: 'root'
})
export class HealthTestsService {

  public healthTests: any[] = data.tests;

  constructor() {
    console.log(this.healthTests);
  }
}
