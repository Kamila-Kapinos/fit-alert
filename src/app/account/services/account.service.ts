import { Injectable, inject } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import firebase from 'firebase/compat/app';
import {User} from "../models/user";
import { Firestore, collection, getDocs, query } from '@angular/fire/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  currentUser: User = {name: "", surname: "", email: "", phone: ""};
  userId: any;
  private firestore: Firestore = inject(Firestore)
  
  constructor(private auth: AngularFireAuth, private router: Router) {
  }

  loginWithEmail(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('Logowanie udane');
        this.router.navigate(['/']);
        this.userId = result.user?.uid
      })
      .catch(error => {
        return Promise.reject(error.message);
      });
  }
  loginWithGoogle() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        console.log('Logowanie przez Google udane');
        this.router.navigate(['/']);
        this.userId = result.user?.uid
      })
      .catch(error => {
        return Promise.reject(error.message);
      });
  }

  loginWithFacebook() {
    return this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((result) => {
        console.log('Logowanie przez Facebooka udane');
        this.router.navigate(['/']);
        this.userId = result.user?.uid
      })
      .catch(error => {
        return Promise.reject(error.message);
      });
  }

  signUpWithUser(user: User, password: string) {
    this.currentUser = user;
    return this.auth.createUserWithEmailAndPassword(user.email, password)
      .then((result) => {
        this.router.navigate(['/login']);

        this.userId = result.user?.uid
        this.saveUserData(this.currentUser)
      })
      .catch(error => {
        return Promise.reject(error.message);
      });
    }

  async saveUserData(data: Object) {
    try {
      await setDoc(doc(this.firestore, 'user_data', this.userId), data).then(() => { console.log("wysłano dokument") })
    }
    catch (error) {
      console.error("Wystąpił błąd:", error)
    }
  }

  async getUserData() {
    try{
      let user_data = (await getDoc(doc(this.firestore, "user_data", this.userId)));
      if (user_data.exists()) {
        this.currentUser.name = user_data.data()['name'];
        this.currentUser.surname = user_data.data()['surname']
        this.currentUser.email = user_data.data()['email'];
        this.currentUser.phone = user_data.data()['phone']

        // console.log("current user", this.currentUser)
        return this.currentUser
      }

      else {
        console.log("No current user!")
        return this.currentUser
      }      
    }
    catch(error){
      console.error("Please log in to continue", error);
      return this.currentUser
    }

  }

}
