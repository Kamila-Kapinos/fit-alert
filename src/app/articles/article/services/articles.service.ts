import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  constructor(private firestore: Firestore) { }

  async getArticles() {
    const querySnapshot = await getDocs(collection(this.firestore, 'articles'));
    return querySnapshot.docs.map(doc => doc.data());
  }
}
