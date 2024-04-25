import { Injectable, inject } from '@angular/core'
import {DailySurvey} from '../models/daily-survey'
import { CollectionReference, Firestore, addDoc, collection, collectionData, getDocs, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DailyService {
  private firestore: Firestore = inject(Firestore)
  private diary: CollectionReference
  constructor () {
    this.diary = (collection(this.firestore, 'diary'));
    // collectionData(this.diary)
    // console.log("service")
    // itemCollection.forEach((value) => console.log(value))
    this.getDiary()
   }

  async getDiary() {
    let temp = (
     await getDocs(query(collection(this.firestore, 'diary')))
    ).docs.map((diary) => diary.data())
    
    // console.log("function in service", temp)
    return temp
   }



}
