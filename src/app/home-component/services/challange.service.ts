import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private firestore: Firestore = inject(Firestore);
  constructor() {}

  async getChallenges() {
    return (
      await getDocs(query(collection(this.firestore, 'daily-challenges/')))
    ).docs.map((challenges) => challenges.data());
  }
}
