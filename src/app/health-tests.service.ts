import { Injectable } from '@angular/core';
import data from '../assets/questions5.json';

@Injectable({
  providedIn: 'root'
})
export class HealthTestsService {

  public healthTests: any[] = data.tests;

  constructor() {}
}
