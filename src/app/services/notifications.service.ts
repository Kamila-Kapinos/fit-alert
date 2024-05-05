import { Injectable, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private popup: NgbModal) {}

  public async sendNotification(title: string, text: string) {
    console.log('In notification func');

    // const webpush = require('web-push');
    // const vapidKeys = webpush.generateVAPIDKeys();
    // console.log(vapidKeys);
    if (Notification.permission == 'default') {
      Notification.requestPermission().then((result) => {
        console.log(result);
      });
    }

    this.popup.open(text);


    if (!window.Notification) {
      console.log('Not supported');
    } else {
      new Notification(title, { body: text });
      console.log('Sent notification');
    }
  }

}
