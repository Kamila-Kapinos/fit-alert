import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { User } from '../models/user';
import { Firestore } from '@angular/fire/firestore';
import { Timestamp, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { DailyService } from '../../activities/services/daily.service';
import { NotificationsService } from '../../services/notifications.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  currentUser: User = { name: '', surname: '', email: '', phone: '' };
  userId: any;
  private firestore: Firestore = inject(Firestore);

  constructor(private auth: AngularFireAuth, private router: Router, private dailyService: DailyService, private notificationsService: NotificationsService) {
    this.getUserData();
  }

  private saveUserID(result: firebase.auth.UserCredential) {
    this.userId = result.user?.uid;
    sessionStorage.setItem('userID', this.userId);
    this.getUserData();
    sessionStorage.setItem('userName', this.currentUser.name);
    this.notificationsService.sendNotification("Succesful login", "Succesfully logged in!");
    console.log("after not func");
  }

  loginWithEmail(email: string, password: string) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('Logowanie udane');
        this.router.navigate(['/']);
        this.saveUserID(result);
      })
      .catch((error) => {
        return Promise.reject(error.message);
      });
  }

  loginWithGoogle() {
    return this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        console.log('Logowanie przez Google udane');
        this.router.navigate(['/']);
        this.saveUserID(result);
      })
      .catch((error) => {
        return Promise.reject(error.message);
      });
  }

  loginWithFacebook() {
    return this.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((result) => {
        console.log('Logowanie przez Facebooka udane');
        this.router.navigate(['/']);
        this.saveUserID(result);
      })
      .catch((error) => {
        return Promise.reject(error.message);
      });
  }

  signUpWithUser(user: User, password: string) {
    this.currentUser = user;
    return this.auth
      .createUserWithEmailAndPassword(user.email, password)
      .then((result) => {
        this.router.navigate(['/login']);

        this.userId = result.user?.uid;
        this.createUserCollections();
        this.saveUserData(this.currentUser);
      })
      .catch((error) => {
        return Promise.reject(error.message);
      });
  }
  private async createUserCollections() {
    await setDoc(doc(this.firestore, 'users', this.userId), {});
    await setDoc(
      doc(this.firestore, 'users/' + this.userId + '/diary', this.getCurrentDate()),
      {
        "excercise": "",
        "sleep": "",
        "time": Timestamp.now(),
        "training": 0,
        "veggies": 0,
        "water": 0
      }
    );
    await setDoc(
      doc(this.firestore, 'users/' + this.userId + '/accountData', 'init'),
      {}
    );
    await setDoc(
      doc(this.firestore, 'users/' + this.userId + '/activities', 'init'),
      {}
    );
  }

  async saveUserData(data: Object) {
    try {
      await setDoc(
        doc(this.firestore, 'users/' + this.userId + '/accountData', 'data'),
        data
      ).then(() => {
        console.log('wysłano dokument');
      });
    } catch (error) {
      console.error('Wystąpił błąd:', error);
    }
  }

  async getUserData() {
    try {
      this.userId = sessionStorage.getItem('userID');
      let user_data = await getDoc(
        doc(this.firestore, 'users/' + this.userId + '/accountData', 'data')
      );
      if (user_data.exists()) {
        this.currentUser.name = user_data.data()['name'];
        this.currentUser.surname = user_data.data()['surname'];
        this.currentUser.email = user_data.data()['email'];
        this.currentUser.phone = user_data.data()['phone'];

        return this.currentUser;
      } else {
        console.log('No current user!');
        return this.currentUser;
      }
    } catch (error) {
      console.error('Please log in to continue', error);
      return this.currentUser;
    }
  }

  public getCurrentDate() {
    // gets date looking like that: 26.04.2024
    const dzisiaj = new Date();
    const dzien = String(dzisiaj.getDate()).padStart(2, '0');
    const miesiac = String(dzisiaj.getMonth() + 1).padStart(2, '0');
    const rok = dzisiaj.getFullYear();

    const data = `${dzien}.${miesiac}.${rok}`;
    return data;
  }

  async isAuthenticated() {
    const user = await this.auth.currentUser;
    console.log({isAuth: user})
    return user !== null;
  }

  logout() {
    this.auth.signOut()
      .then(() => {
        // Logout successful
        alert('Logout successful.');
      })
      .catch((error) => {
        // An error occurred
        alert('An error occurred while logging out: ' + error.message);
      });
  }
}
