import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DailySurvey } from '../../models/daily-survey';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-daily-survey',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './daily-survey.component.html',
  styleUrl: './daily-survey.component.scss'
})
export class DailySurveyComponent {

  public dailySurvey: DailySurvey = new DailySurvey()
  
  constructor(){

  }

  onSubmit(form: NgForm) {
    console.log(form.value)
  }


}
