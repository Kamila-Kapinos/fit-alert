import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadString, listAll, getDownloadURL } from '@angular/fire/storage';
import 'firebase/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private storage: Storage = inject(Storage);

  private userID: string | null = sessionStorage.getItem("userID");
  private storageRef = ref(this.storage);
  private catalogRef;
  private photos: string[] = [];
  constructor() {
    if (this.userID != null) {

      this.catalogRef = ref(this.storageRef, this.userID)
    }
    else{
      console.log("userID is null!",this.userID);
    }
  }

  sendPhoto(photo: string) {
    console.log('sending photo');

    const rawDate = new Date();
    const dd = String(rawDate.getDate()).padStart(2, '0');
    const mm = String(rawDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = rawDate.getFullYear();
    const hh = String(rawDate.getHours());
    const mins = String(rawDate.getMinutes());
    const sec = String(rawDate.getSeconds());
    const date = dd + '_' + mm + '_' + yyyy + '_' + hh + '_' + mins + '_' + sec;
    let pathRef;
    try {
      if (typeof this.catalogRef != 'undefined') {

        pathRef = ref(this.catalogRef, date);
        uploadString(pathRef, photo, 'data_url').then(() => {
          console.log("Succes uploading photo as data_url!")
        })

      }
      else {
        console.log("error sending photo: catalog is undefined");
      }
    }
    catch {
      console.log("error sending photo: catch block");
    }

  }

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
        const urlPromises = fileRefList.items.map(fileRef => {
          return getDownloadURL(fileRef);
        });

        // Wait for all promises to resolve
        const urls = await Promise.all(urlPromises);
        console.log("photo service urls",urls)
        this.photos = urls;
        return this.photos;
      }
      catch {
        console.log("error getting all photos");
        return [];
      }
    }
  }
}


