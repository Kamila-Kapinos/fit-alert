import { Injectable } from '@angular/core'
import {DailySurvey} from '../models/daily-survey'
import { Firestore, addDoc, collection, getDocs, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DailyService {

  constructor (public firestore: Firestore) { }

  async getDiary() {
    return (
     await getDocs(query(collection(this.firestore, 'diary')))
    ).docs.map((diary) => diary.data())
   }

}
