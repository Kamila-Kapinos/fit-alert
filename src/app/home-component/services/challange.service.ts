import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { AccountService } from '../../account/services/account.service';
import { getDoc } from 'firebase/firestore';
import { take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface ChallengeCompleted {
  date: string;
  challenge: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private firestore: Firestore = inject(Firestore);
  constructor(
    private accountService: AccountService,
    private auth: AngularFireAuth,
  ) {}

  async getChallenges() {
    return (
      await getDocs(query(collection(this.firestore, 'daily-challenges/')))
    ).docs.map((challenges) => challenges.data());
  }

  async saveCompletedChallenge(data: ChallengeCompleted) {
    try {
      const fbUser = await this.auth.authState.pipe(take(1)).toPromise();
      const challenges: ChallengeCompleted[] =
        await this.getCompletedChallenges();
      console.log({ challenges });
      if (challenges.find((el) => el.date === data.date)) {
        return -1;
      } else {
        await setDoc(
          doc(
            this.firestore,
            'users/' + fbUser?.uid + '/completed-challenges',
            data.date,
          ),
          data,
        );
        return 0;
      }
    } catch (error) {
      console.error(error);
      return -2;
    }
  }

  async getCompletedChallenges(): Promise<ChallengeCompleted[]> {
    try {
      const fbUser = await this.auth.authState.pipe(take(1)).toPromise();
      const querySnapshot = await getDocs(
        collection(
          this.firestore,
          'users/' + fbUser?.uid + '/completed-challenges',
        ),
      );
      return querySnapshot.docs.map((doc) => doc.data() as ChallengeCompleted);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
