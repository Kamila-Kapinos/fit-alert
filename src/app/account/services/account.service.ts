import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private auth: AngularFireAuth, private router: Router) {}

  loginWithEmail(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Logowanie udane');
        this.router.navigate(['/']);
      })
      .catch(error => {
        return Promise.reject(error.message);
      });
  }
  loginWithGoogle() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        console.log('Logowanie przez Google udane');
        this.router.navigate(['/']);
      })
      .catch(error => {
        return Promise.reject(error.message);
      });
  }

  loginWithFacebook() {
    return this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(() => {
        console.log('Logowanie przez Facebooka udane');
        this.router.navigate(['/']);
      })
      .catch(error => {
        return Promise.reject(error.message);
      });
  }
}
