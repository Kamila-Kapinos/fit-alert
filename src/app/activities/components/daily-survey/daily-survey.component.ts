import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DailySurvey } from '../../models/daily-survey';
import { FormsModule } from "@angular/forms";
import { Firestore, Timestamp } from '@angular/fire/firestore';
import { DailyService } from '../../services/daily.service';

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


  constructor(public firestore: Firestore, public dailyService: DailyService, public dailySurvey: DailySurvey) {
  }

  ngOnInit() {
    this.dailyService.getDailyLog(this.dailyService.getCurrentDate()).then(data => this.dailySurvey = data)
  }

  async onSubmit(form: NgForm) {
    try {
      let data = {
        "excercise": form.value.excercise,
        "sleep": form.value.sleep,
        "time": Timestamp.now(),
        "training": form.value.training,
        "veggies": form.value.veggies,
        "water": form.value.water
      }
      this.dailyService.sendDiaryLog(data)
    }
    catch (error) {
      console.error("Wystąpił błąd:", error)
    }

  }



}
