import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-daily-survey',
  standalone: true,
  imports: [],
  templateUrl: './daily-survey.component.html',
  styleUrl: './daily-survey.component.scss'
})
export class DailySurveyComponent {
  onSubmit(form: NgForm) {
    console.log(form.value)
  }

}
