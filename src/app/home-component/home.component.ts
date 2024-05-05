import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '../articles/article/services/articles.service';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationsService } from '../services/notifications.service';
import { AccountService } from '../account/services/account.service';
import { DailyService } from '../activities/services/daily.service';
import { ChallengeService } from './services/challange.service';
import firebase from 'firebase/compat';
import DocumentData = firebase.firestore.DocumentData;
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgForOf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  userName: string = '';
  streakCounter = 0;
  trendingArticles: any[] = [];
  randomChallenge: any;

  constructor(
    private articlesService: ArticlesService,
    private notificationsService: NotificationsService,
    private accountService: AccountService,
    private dailyService: DailyService,
    private challengeService: ChallengeService,
  ) {

  }

  ngOnInit(): void {

      this.userName = this.accountService.currentUser?.name ?? '';
      this.articlesService
        .getArticles()
        .then((data: any) => {
          this.trendingArticles = data;
        })
        .catch((error: any) => {
          console.error('Error fetching articles:', error);
        });

      this.setChallengeOfDay().then(() => {});
      this.setStreakCounter().then(() => {});
  }

  async setChallengeOfDay() {
    try {
      const challenges = await this.challengeService.getChallenges();
      const length = challenges.length;
      const dayOfMonth = (new Date()).getDate();
      const index = dayOfMonth % length;
      this.randomChallenge = challenges[index]['challenge'];
    } catch (error: any) {
      console.error('Error fetching challenges:', error);
    }
  }

  async setStreakCounter() {
    const completed = await this.challengeService.getCompletedChallenges();
    this.streakCounter = completed.length;
  }

  async challengeCompleted(challenge: string) {
    const ret = await this.challengeService.saveCompletedChallenge(      {
      date: (new Date()).toISOString().substring(0, 10),
      challenge: challenge
    })

    if (
        ret === 0
    ) {
      if(navigator.vibrate([100,30,300,30])){console.log("success vibrating")}
      else {console.log("failed to vibrate");}
      const audio = new Audio("../../assets/audio1.mp3");
      audio.play();

      this.notificationsService.sendNotification(
        'Challenge completed',
        'Congrats on completing challenge! Keep up good work!',
      );

      this.streakCounter++;
    } else if (ret === -1) {
      this.notificationsService.sendNotification(
        'Challenge already completed today',
        'You have already completed the challenge today!',
      );
    }
  }

  handleEmotionClick(emotion: string) {
    this.dailyService.addEmotionToDiary(emotion);
  }
}
