import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query } from '@angular/fire/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DailySurvey } from '../models/daily-survey';

@Injectable({
  providedIn: 'root',
})
export class DailyService {
  private firestore: Firestore = inject(Firestore);
  private userId: any;
  constructor(private dailySurvey: DailySurvey) {
    this.userId = sessionStorage.getItem('userID');
  }

  async getDiary() {
    return (
      await getDocs(
        query(collection(this.firestore, 'users/' + this.userId + '/diary')),
      )
    ).docs.map((diary) => diary.data());
  }

  async getDailyLog(docName: string) {
    let log = await getDoc(
      doc(this.firestore, 'users/' + this.userId + '/diary', docName),
    );
    if (log.exists()) {
      this.dailySurvey.creationTime = log.data()['time'];
      this.dailySurvey.excerciseOfTheDay = log.data()['excercise'];
      this.dailySurvey.glassesOfWater = log.data()['water'];
      this.dailySurvey.sleepQuality = log.data()['sleep'];
      this.dailySurvey.veggiesInMeals = log.data()['veggies'];
      this.dailySurvey.trainingTime = log.data()['training'];
      this.dailySurvey.emotions = log.data()['emotions'];

      return this.dailySurvey;
    } else {
      return this.dailySurvey;
    }
  }

  async sendDiaryLog(data: Object) {
    try {
      const currentDate = this.getCurrentDate();
      const docRef = doc(
        this.firestore,
        `users/${this.userId}/diary/${currentDate}`,
      );

      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data() : {};

      const newData = { ...currentData, ...data };

      await setDoc(docRef, newData);

      console.log('Dokument wysłany pomyślnie.');
    } catch (error) {
      console.error('Wystąpił błąd podczas wysyłania dokumentu:', error);
    }
  }

  async addEmotionToDiary(emotion: string) {
    try {
      const currentDateTime = new Date();
      const currentDate = this.getCurrentDate();
      const docRef = doc(
        this.firestore,
        `users/${this.userId}/diary/${currentDate}`,
      );
      const docSnap = await getDoc(docRef);
      let emotions = [];
      if (docSnap.exists()) {
        emotions = docSnap.data()['emotions'] || [];
      }
      emotions.push({ emotion, dateTime: currentDateTime });
      await setDoc(docRef, { emotions }, { merge: true });
      console.log(
        'Dodano emocję do dziennika:',
        emotion,
        'o godzinie:',
        currentDateTime,
      );
    } catch (error) {
      console.error('Błąd podczas dodawania emocji do dziennika:', error);
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
