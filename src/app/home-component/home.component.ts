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
  lastChallengeDate: Date | null = null;

  constructor(
    private articlesService: ArticlesService,
    private notificationsService: NotificationsService,
    private accountService: AccountService,
    private dailyService: DailyService,
    private challengeService: ChallengeService,
  ) {}

  ngOnInit(): void {
    const streakCounterString = localStorage.getItem('streakCounter');
    if (streakCounterString) {
      this.streakCounter = parseInt(streakCounterString, 10);
    }
    this.userName = this.accountService.currentUser?.name ?? '';
    this.articlesService
      .getArticles()
      .then((data: any) => {
        this.trendingArticles = data;
        console.log(data);
      })
      .catch((error: any) => {
        console.error('Error fetching articles:', error);
      });

    const lastChallengeDateString = localStorage.getItem('lastChallengeDate');
    if (lastChallengeDateString) {
      const lastChallengeDate = new Date(lastChallengeDateString);
      const today = new Date();
      if (
        today.getDate() !== lastChallengeDate.getDate() ||
        today.getMonth() !== lastChallengeDate.getMonth() ||
        today.getFullYear() !== lastChallengeDate.getFullYear()
      ) {
        this.getRandomChallenge();
      } else {
        const lastChallenge = localStorage.getItem('lastChallenge');
        if (lastChallenge) {
          this.randomChallenge = JSON.parse(lastChallenge);
        }
      }
    } else {
      this.getRandomChallenge();
    }
  }

  async getRandomChallenge() {
    try {
      const challenges = await this.challengeService.getChallenges();
      const randomIndex = Math.floor(Math.random() * challenges.length);
      this.randomChallenge = challenges[randomIndex];

      localStorage.setItem('lastChallengeDate', new Date().toISOString());
      localStorage.setItem(
        'lastChallenge',
        JSON.stringify(this.randomChallenge),
      );
    } catch (error: any) {
      console.error('Error fetching challenges:', error);
    }
  }

  challengeCompleted() {
    const lastCompletedDate = localStorage.getItem('lastCompletedDate');
    if(navigator.vibrate([100,30,300,30])){console.log("success vibrating")}
    else {console.log("failed to vibrate");}
    if (
      !lastCompletedDate ||
      new Date(lastCompletedDate).toDateString() !== new Date().toDateString()
    ) {

      this.notificationsService.sendNotification(
        'Challenge completed',
        'Congrats on completing challenge! Keep up good work!',
      );

      this.streakCounter++;

      localStorage.setItem('streakCounter', String(this.streakCounter));
      localStorage.setItem('lastCompletedDate', new Date().toDateString());
    } else {
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
