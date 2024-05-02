import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  public async sendNotification(title: string, text: string){
    console.log("In notification func")

    // const webpush = require('web-push');
    // const vapidKeys = webpush.generateVAPIDKeys();
    // console.log(vapidKeys);
    if(Notification.permission == 'default'){
      Notification.requestPermission().then((result) => {
        console.log(result);
      });
    }

    if(!window){
      console.log("Not supported")
    }
  
    new Notification(title, {body: text})
    window.navigator.vibrate([200, 100, 200]);

    console.log("Sent notification")
  }
}
