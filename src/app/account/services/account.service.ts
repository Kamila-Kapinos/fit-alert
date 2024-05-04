import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { User } from '../models/user';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { Observable, Observer, take } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  currentUser: User | null = null;
  userId: any;
  private firestore: Firestore = inject(Firestore);

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private notificationsService: NotificationsService,
  ) {}

  private saveUserID(result: firebase.auth.UserCredential) {
    this.userId = result.user?.uid;
    sessionStorage.setItem('userID', this.userId);
    this.notificationsService.sendNotification(
      'Succesful login',
      'Succesfully logged in!',
    );
    console.log('after not func');
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
    return this.auth
      .createUserWithEmailAndPassword(user.email, password)
      .then((result) => {
        this.userId = result.user?.uid;
        this.createUserCollections();
        this.saveUserData(user);
        return user;
      });
  }
  private async createUserCollections() {
    await setDoc(doc(this.firestore, 'users', this.userId), {});
    await setDoc(
      doc(
        this.firestore,
        'users/' + this.userId + '/diary',
        this.getCurrentDate(),
      ),
      {
        excercise: '',
        sleep: '',
        time: Timestamp.now(),
        training: 0,
        veggies: 0,
        water: 0,
        emotions: [],
      },
    );
    await setDoc(
      doc(this.firestore, 'users/' + this.userId + '/accountData', 'init'),
      {},
    );
    await setDoc(
      doc(this.firestore, 'users/' + this.userId + '/activities', 'init'),
      {},
    );
  }

  async saveUserData(data: Object) {
    try {
      await setDoc(
        doc(this.firestore, 'users/' + this.userId + '/accountData', 'data'),
        data,
      ).then(() => {
        console.log('wysłano dokument');
      });
    } catch (error) {
      console.error('Wystąpił błąd:', error);
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
    const fbUser = await this.auth.authState.pipe(take(1)).toPromise();
    if (fbUser && !this.currentUser) {
      let user_data = (
        await getDoc(
          doc(this.firestore, 'users/' + fbUser?.uid + '/accountData', 'data'),
        )
      )?.data();
      if (user_data) {
        this.currentUser = {
          name: user_data['name'],
          surname: user_data['surname'],
          email: fbUser.email ?? '',
          phone: user_data['phone'],
        };
      }
    }
    return !!fbUser;
  }

  logout() {
    this.auth
      .signOut()
      .then(() => {
        sessionStorage.removeItem('userID');
        this.currentUser = null;
      })
      .catch((error) => {
        alert('An error occurred while logging out: ' + error.message);
      });
  }

  checkIfEmailExists(email: string): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      this.auth
        .fetchSignInMethodsForEmail(email)
        .then((signInMethods: string[]) => {
          const exists: boolean = signInMethods.length > 0;
          console.log(signInMethods);
          observer.next(exists);
          observer.complete();
        })
        .catch((error: any) => {
          console.error('Error fetching sign-in methods for email:', error);
          observer.error(error);
        });
    });
  }
}
