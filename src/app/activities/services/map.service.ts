import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
} from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';
import { AccountService } from '../../account/services/account.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private firestore: Firestore = inject(Firestore);

  constructor(private accountService: AccountService) {
    // this.userId = "testID"
  }

  async saveActivity(data: Object) {
    try {
      await setDoc(
        doc(
          this.firestore,
          'users/' + this.accountService.userId + '/map',
          uuidv4(),
        ),
        data,
      ).then(() => {
        console.log('wysłano dokument');
      });
    } catch (error) {
      console.error('Wystąpił błąd:', error);
    }
  }

  async getActivitiesLocations() {
    return (
      await getDocs(
        query(
          collection(
            this.firestore,
            'users/' + this.accountService.userId + '/map',
          ),
        ),
      )
    ).docs.map((activities) => activities.data());
  }
}
