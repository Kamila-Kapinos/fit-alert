import { Injectable } from '@angular/core';
import 'firebase/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  //private firestore: Firestore = inject(Firestore);
  // private firebase;
  //   private userId: string|null;
  //   //private firebase: FirebaseApp = new FirebaseApp();
  //  private storageRef;
  //  private storage:unknown|undefined;
  //   private catalogRef;
  //   //private firebase:FirebaseApp;
  // private firebaseConfig={
  //   storageBucket:'[gs://fit-alert-62706.appspot.com]',
  // }
  constructor() {
    // this.userId = sessionStorage.getItem("userID");
    // this.userId = "test1";
    // //this.firebase = initializeApp(this.firebaseConfig);
    // //this.storage = getStorage(AngularFireModule);
    // //const firestore = getFirestore();
    // //this.storage = firebase.storage()
    // this.storage = Storage;
    // this.storageRef = ref(firebase.app().storage())
    // //this.storage = this.storage.firebase;
    // this.storageRef = ref(this.storage);
    // this.catalogRef = ref(this.storageRef,this.userId);
  }

  sendPhoto(photo: string) {
    console.log('sending photo');
  }
  //   const rawDate = new Date();
  //   const dd = String(rawDate.getDate()).padStart(2, '0');
  //   const mm = String(rawDate.getMonth() + 1).padStart(2, '0'); //January is 0!
  //   const yyyy = rawDate.getFullYear();

  //   const date = dd + '/' + mm + '/' + yyyy;
  //   const pathRef = ref(this.catalogRef,date);

  //   uploadString(pathRef, photo, 'data_url').then((snapshot)=>{
  //     console.log("Succes uploading photo as data_url!")
  //   })

  // }
}
