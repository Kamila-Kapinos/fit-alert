import { Injectable, inject } from '@angular/core'
import { Firestore, collection, getDocs, query } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { DailySurvey } from '../models/daily-survey';

@Injectable({
  providedIn: 'root'
})
export class DailyService {
  private firestore: Firestore = inject(Firestore)
  constructor(private dailySurvey: DailySurvey) {
  }

  async getDiary() {
    return (
      await getDocs(query(collection(this.firestore, 'diary')))
    ).docs.map((diary) => diary.data())
  }

  public async getDailyLog() {
    let log = (await getDoc(doc(this.firestore, "diary", this.getCurrentDate())));
    if (log.exists()) {
      this.dailySurvey.creationTime = log.data()['time']
      this.dailySurvey.excerciseOfTheDay = log.data()['excercise']
      this.dailySurvey.glassesOfWater = log.data()['water']
      this.dailySurvey.sleepQuality = log.data()['sleep']
      this.dailySurvey.veggiesInMeals = log.data()['veggies']
      this.dailySurvey.trainingTime = log.data()['training']

      return this.dailySurvey;

    }
    else {
      return this.dailySurvey;
    }
  }

  public getCurrentDate() {
    // gets date looking like that: 26.04.2024
    const dzisiaj = new Date();
    const dzien = String(dzisiaj.getDate()).padStart(2, '0');
    const miesiac = String(dzisiaj.getMonth() + 1).padStart(2, '0');
    const rok = dzisiaj.getFullYear();

    const data = `${dzien}.${miesiac}.${rok}`;
    return data;
  }
}
