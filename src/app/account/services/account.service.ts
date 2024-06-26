import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { User } from '../models/user';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { Observable, Observer, take } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private modal: NgbModal,
  ) {}

  private saveUserID(result: firebase.auth.UserCredential) {
    this.userId = result.user?.uid;
    sessionStorage.setItem('userID', this.userId);
    // this.notificationsService.sendNotification(
    //   'Succesful login',
    //   'Succesfully logged in!',
    // );
  }

  loginWithEmail(email: string, password: string) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(async (result) => {
        console.log('Logowanie udane');
        this.router.navigate(['/']);
        this.saveUserID(result);
        if (result.user) {
          const userDocRef = doc(this.firestore, `users/${result.user.uid}`);
          const userDocSnapshot = await getDoc(userDocRef);
          console.log(result.user);

          if (!userDocSnapshot.exists()) {
            this.createUserCollections();
            this.saveUserData({
              name: '',
              surname: '',
              email: email,
              phone: '',
            });
            this.router.navigate(['/account']);
            this.modal.open('Please set your name and last name.');
          }
        
        }

        const challangeDocSnapshot = await getDoc(doc(this.firestore, `users/${this.userId}/activities`, "challengeStreak"));
        if(!challangeDocSnapshot.exists()){
          console.log("doesn't exist")
          await setDoc(
            doc(this.firestore, 'users/' + this.userId + '/activities', 'challengeStreak'),
            {
              "lastChallenge": "",
              "lastChallengeDate": this.getYesterdayTimestamp(),
              "streakCounter": 0
            },
          );
        }
        else{
          console.log("exists")
        }
      })
      .catch((error) => {
        return Promise.reject(error.message);
      });
  }

  loginWithGoogle(user: User) {
    return this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(async (result) => {
        console.log('Logowanie przez Google udane');
        this.router.navigate(['/']);
        this.saveUserID(result);
        if (result.user) {
          const userDocRef = doc(this.firestore, `users/${result.user.uid}`);
          const userDocSnapshot = await getDoc(userDocRef);

          if (!userDocSnapshot.exists()) {
            this.createUserCollections();
            this.saveUserData(user);
          }
        }
      })
      .catch((error: any) => {
        // Explicitly specify the type of 'error'
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
      doc(this.firestore, 'users/' + this.userId + '/activities', 'challengeStreak'),
      {
        "lastChallenge": "",
        "lastChallengeDate": this.getYesterdayTimestamp(),
        "streakCounter": 0
      },
    );
  }

  async saveUserData(data: Object) {
    const fbUser = await this.auth.authState.pipe(take(1)).toPromise();
    try {
      if (!fbUser || !fbUser?.uid) {
        console.error('User not logged in or user ID is undefined');
        return;
      }
      await setDoc(
        doc(this.firestore, 'users/' + fbUser?.uid + '/accountData', 'data'),
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

  getYesterdayTimestamp() {
    // Pobieramy aktualny timestamp
    const now = new Date();
    
    // Ustawiamy datę na dzisiaj
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Odejmujemy jeden dzień
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Zamieniamy na timestamp
    const yesterdayTimestamp = firebase.firestore.Timestamp.fromDate(yesterday);

    return yesterdayTimestamp;
  }
}
