import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, setDoc } from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private firestore: Firestore = inject(Firestore);
  private userId: any;
  
  constructor() { 
    this.userId = sessionStorage.getItem('userID')
    // this.userId = "testID"
  }

  async saveActivity(data: Object) {
    try {
      await setDoc(
        doc(
          this.firestore,
          'users/' + this.userId + '/map',
          uuidv4()
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
        query(collection(this.firestore, 'users/' + this.userId + '/map')),
      )
    ).docs.map((activities) => activities.data());
  }

}
