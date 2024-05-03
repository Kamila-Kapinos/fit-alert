import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query } from '@angular/fire/firestore';
import { limit, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(private firestore: Firestore) {}

  async queryArticle(articleID: string | null): Promise<unknown> {
    if (articleID != null) {
      const querySnapshot = await getDocs(
        query(
          collection(this.firestore, 'articles'),
          where('articleID', '==', articleID),
          limit(1),
        ),
      );
      return querySnapshot.docs.map((doc) => doc.data());
    } else {
      return Promise.reject('articleID is null');
    }
  }
  async getArticles() {
    const querySnapshot = await getDocs(collection(this.firestore, 'articles'));
    return querySnapshot.docs.map((doc) => doc.data());
  }
}
