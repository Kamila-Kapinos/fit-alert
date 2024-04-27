import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DailySurvey } from '../../models/daily-survey';
import { FormsModule } from "@angular/forms";
import { Firestore, Timestamp } from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore';
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
    this.dailyService.getDailyLog().then(data => this.dailySurvey = data)
  }

  async onSubmit(form: NgForm) {
    console.log(form.value.water)
    try {
      await setDoc(doc(this.firestore, 'diary', this.dailyService.getCurrentDate()), {
        "excercise": form.value.excercise,
        "sleep": form.value.sleep,
        "time": Timestamp.now(),
        "training": form.value.training,
        "veggies": form.value.veggies,
        "water": form.value.water
      }).then(() => { console.log("wysłano dokument") })

    }
    catch (error) {
      console.error("Wystąpił błąd:", error)
    }

  }



}
