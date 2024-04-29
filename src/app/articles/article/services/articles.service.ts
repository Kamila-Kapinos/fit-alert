import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection,doc, getDoc, getDocs, query } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  private firestore:Firestore = inject(Firestore)
  constructor() { 
    this.getArticles();
  }
  async getArticles(amount:number=4){
    let articles:any = (await(getDocs(query(collection(this.firestore,'articles')))))
      .docs.map((articles)=>articles.data());
    console.log(articles);
    return articles;
  }
}
