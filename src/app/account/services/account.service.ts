import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import firebase from 'firebase/compat/app';
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  currentUser: User = {name: "", surname: "", email: "", phone: "", hashedPassword: ""};
  
  constructor(private auth: AngularFireAuth, private router: Router) {
  }

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

  signUpWithUser(user: User) {
    this.currentUser = user;
    return this.auth.createUserWithEmailAndPassword(user.email, user.hashedPassword)
      .then((result) => {
        console.log('Rejestracja udana');
        // Tutaj możesz dodać logikę zapisywania innych danych użytkownika do bazy danych
        this.router.navigate(['/']);
      })
      .catch(error => {
        return Promise.reject(error.message);
      });
  }
}
