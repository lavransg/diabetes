import { Injectable } from '@angular/core';
import healthTests from '../assets/healthTests.json';

@Injectable({
  providedIn: 'root'
})
export class HealthTestsService {

  public healthTests: any[] = healthTests.tests;

  constructor() {
    console.log(this.healthTests);
  }
}
