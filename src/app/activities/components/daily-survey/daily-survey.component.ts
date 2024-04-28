import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DailySurvey } from '../../models/daily-survey';
import {FormsModule} from "@angular/forms";
import { Firestore, Timestamp, addDoc, collection, getDocs, query } from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore';

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
  
  constructor(public firestore: Firestore){

  }

  async onSubmit(form: NgForm) {
    console.log(form.value.water)
    try{
      await setDoc(doc(this.firestore, 'diary', this.getCurrentDate()), {
        "excercise": form.value.excercise,
        "sleep": form.value.sleep,
        "time": Timestamp.now() ,
        "training": form.value.training,
        "veggies": form.value.veggies,
        "water": form.value.water
      }).then(() => {console.log("wysłano dokument")})

    }
    catch(error){
      console.error("Wystąpił błąd:", error)
    }

  }

  private getCurrentDate() {
    //gets date looking like that: 26.04.2024
    const dzisiaj = new Date();
    const dzien = String(dzisiaj.getDate()).padStart(2, '0');
    const miesiac = String(dzisiaj.getMonth() + 1).padStart(2, '0'); 
    const rok = dzisiaj.getFullYear();

    const data = `${dzien}.${miesiac}.${rok}`;
    return data;
  }

}
