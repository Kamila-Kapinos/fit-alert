import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  public sendNotification(title: string, text: string){
    if(Notification.permission == 'default'){
      Notification.requestPermission().then((result) => {
        console.log(result);
      });
    }

    new Notification(title, {body: text})
  }
}
