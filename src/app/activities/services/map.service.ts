import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, setDoc } from '@angular/fire/firestore';
import { randomUUID } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private firestore: Firestore = inject(Firestore);
  private userId: any;
  
  constructor() { }

  async saveActivity(data: Object) {
    try {
      await setDoc(
        doc(
          this.firestore,
          'users/' + this.userId + '/map',
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
        query(collection(this.firestore, 'users/' + 'testID' + '/map')),
      )
    ).docs.map((activities) => activities.data());
  }

}
