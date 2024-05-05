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
import { take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private firestore: Firestore = inject(Firestore);

  constructor(private auth: AngularFireAuth) {
  }

  async saveActivity(data: Object) {
    const fbUser = await this.auth.authState.pipe(take(1)).toPromise();
    console.log('Saving activity data:', data);
    try {
      await setDoc(
        doc(this.firestore, 'users/' + fbUser?.uid + '/map', uuidv4()),
        data,
      ).then(() => {
        console.log('wysłano dokument');
      });
    } catch (error) {
      console.error('Error occurred while saving activity:', error);
    }
  }

  async getActivitiesLocations() {
    const fbUser = await this.auth.authState.pipe(take(1)).toPromise();
    console.log('Fetching activity locations for user ID:', fbUser?.uid);
    try {
      const snapshot = await getDocs(
        query(collection(this.firestore, 'users/' + fbUser?.uid + '/map')),
      );
      const activities = snapshot.docs.map((doc) => doc.data());
      console.log('Fetched activity locations:', activities);
      return activities;
    } catch (error) {
      console.error('Error occurred while fetching activity locations:', error);
      throw error;
    }
  }
}
