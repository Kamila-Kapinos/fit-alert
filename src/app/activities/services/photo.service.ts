import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadString, listAll, getDownloadURL } from '@angular/fire/storage';
import 'firebase/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private storage: Storage = inject(Storage);
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
  private userID: string | null = sessionStorage.getItem("userID");
  private storageRef = ref(this.storage);
  private catalogRef;
  private photos: string[] = [];
  constructor() {
    if (this.userID != null) {

      this.catalogRef = ref(this.storageRef, this.userID)
    }
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

    const rawDate = new Date();
    const dd = String(rawDate.getDate()).padStart(2, '0');
    const mm = String(rawDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = rawDate.getFullYear();
    const hh = String(rawDate.getHours());
    const mins = String(rawDate.getMinutes());
    const date = dd + '_' + mm + '_' + yyyy + '_' + hh + '_' + mins;
    let pathRef;
    try {
      if (typeof this.catalogRef != 'undefined') {

        pathRef = ref(this.catalogRef, date);
        uploadString(pathRef, photo, 'data_url').then(() => {
          console.log("Succes uploading photo as data_url!")
        })

      }
      else {
        console.log("error sending photo");
      }
    }
    catch {
      console.log("error sending photo");
    }

  }


  // async getAllPhotos2() {
  //   this.photos = [];
  //   console.log("getting all photos!")
  //   if (typeof this.catalogRef != 'undefined') {
  //     // Find all the prefixes and items.
  //     listAll(this.catalogRef)
  //       .then((res) => {
  //         res.items.forEach(async (itemRef) => {
  //           // All the items under listRef.
  //           // Get the download URL
  //           console.log("getting all photo urls!")
  //           return await
  //             getDownloadURL(itemRef)
  //               .then((url) => {
  //                 // Insert url into an <img> tag to "download"
  //                 this.photos = this.photos.concat([url]);
  //                 console.log(this.photos);

  //               })
  //               .catch((error) => {
  //                 // A full list of error codes is available at
  //                 // https://firebase.google.com/docs/storage/web/handle-errors
  //                 console.log("failed to get photo urls!")
  //                 switch (error.code) {
  //                   case 'storage/object-not-found':
  //                     // File doesn't exist
  //                     break;
  //                   case 'storage/unauthorized':
  //                     // User doesn't have permission to access the object
  //                     break;
  //                   case 'storage/canceled':
  //                     // User canceled the upload
  //                     break;

  //                   // ...

  //                   case 'storage/unknown':
  //                     // Unknown error occurred, inspect the server response
  //                     break;
  //                 }
  //               })
  //           console.log(this.photos);

  //         });
  //       }).catch((error) => {
  //         // Uh-oh, an error occurred!
  //         console.log("failed to list all photos!");
  //         return [];
  //       }).finally(() => {
  //         console.log("finally returning: ", this.photos);
  //         return this.photos;
  //       });

  //   }
  //   else {

  //     console.log("end of func, returning: ", this.photos);

  //     return this.photos;
  //   }
  // }

  async getAllPhotos() {
    this.photos = [];
    console.log("getting all photos!");
    if (typeof this.catalogRef == 'undefined') {
      console.log("no reference to user catalog");
      return []
    }
    else {
      try {
        const fileRefList = await listAll(this.catalogRef);
        //console.log("file refs: ", fileRefList);
        const urlPromises = fileRefList.items.map(fileRef => {
          return getDownloadURL(fileRef);
      });

      // Wait for all promises to resolve
      const urls = await Promise.all(urlPromises);
      this.photos = urls;
      //console.log(this.photos);
      return this.photos;
      }
      catch {
        console.log("error getting all photos");
        return [];
      }
    }
  }
}


