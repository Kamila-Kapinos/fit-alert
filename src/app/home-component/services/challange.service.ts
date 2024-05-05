import { inject, Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, query, setDoc, Timestamp } from '@angular/fire/firestore';
import { AccountService } from '../../account/services/account.service';
import { getDoc } from 'firebase/firestore';
import { take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private firestore: Firestore = inject(Firestore);
  constructor(private accountService: AccountService, private auth: AngularFireAuth) {
  }

  async getChallenges() {
    return (
      await getDocs(query(collection(this.firestore, 'daily-challenges/')))
    ).docs.map((challenges) => challenges.data());
  }

  async saveCompletedChallenge(data: Object){
    try{
      const fbUser = await this.auth.authState.pipe(take(1)).toPromise();
      await setDoc(
      doc(this.firestore, "users/"+fbUser?.uid+"/activities", "challengeStreak"), data)
      console.log("Challenge saved", data, this.accountService.userId)
    }
    catch(error){
      console.error(error)
    }
  }

  async getChallengeInfo(){
    try{
      const fbUser = await this.auth.authState.pipe(take(1)).toPromise();
      let info = await getDoc(
      doc(this.firestore, "users/"+fbUser?.uid+"/activities", "challengeStreak"),)
      if(info.exists()){
        let challengeInfo ={
          "lastChallenge": info.data()['lastChallenge'],
          "lastChallengeDate": info.data()['lastChallengeDate'],
          "streakCounter": info.data()['streakCounter']
        }
        return challengeInfo;        
      }

    }
    catch(error){
      console.error(error)
    }
    return       {
      "lastChallenge": "",
      "lastChallengeDate": Timestamp.now(),
      "streakCounter": 0
    }
  }
}