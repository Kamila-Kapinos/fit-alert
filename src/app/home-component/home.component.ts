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
  lastChallengeDate: Date | null = null;
  challengeInfo: any;

  constructor(
    private articlesService: ArticlesService,
    private notificationsService: NotificationsService,
    private accountService: AccountService,
    private dailyService: DailyService,
    private challengeService: ChallengeService,
  ) {

  }

  ngOnInit(): void {
    // const streakCounterString = localStorage.getItem('streakCounter');
    this.challengeService.getChallengeInfo().then(result => {
      console.log(result);
      this.challengeInfo = {
        "lastChallenge": result.lastChallenge,
        "lastChallengeDate": result.lastChallengeDate,
        "streakCounter": result.streakCounter
      }; 

      console.log("Streak: ", this.challengeInfo.streakCounter)
      const streakCounterString = this.challengeInfo.streakCounter.toString();    
  
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
  
      // const lastChallengeDateString = localStorage.getItem('lastChallengeDate');
      const lastChallengeDateString = new Date(this.challengeInfo.lastChallengeDate).toDateString();
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
          // const lastChallenge = localStorage.getItem('lastChallenge');
          const lastChallenge = this.challengeInfo.lastChallenge;
          if (lastChallenge) {
            this.randomChallenge = (lastChallenge);
          }
        }
      } else {
        this.getRandomChallenge();
      }

    }).catch((error) => {
        console.error('Error fetching diary data:', error);
      });


  }

  async getRandomChallenge() {
    try {
      const challenges = await this.challengeService.getChallenges();
      const randomIndex = Math.floor(Math.random() * challenges.length);
      this.randomChallenge = challenges[randomIndex]['challenge'];

      // localStorage.setItem('lastChallengeDate', new Date().toISOString()); //??

      // localStorage.setItem(
      //   'lastChallenge',
      //   JSON.stringify(this.randomChallenge),
      // );
      
    } catch (error: any) {
      console.error('Error fetching challenges:', error);
    }
  }

  challengeCompleted() {
    // const lastCompletedDate = localStorage.getItem('lastCompletedDate');
    const lastCompletedDate = new Date(this.challengeInfo.lastChallengeDate);
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

      // localStorage.setItem('streakCounter', String(this.streakCounter));
      // localStorage.setItem('lastCompletedDate', new Date().toDateString());
      this.challengeService.saveCompletedChallenge(      {
        "lastChallenge": this.randomChallenge,
        "lastChallengeDate": Timestamp.now(),
        "streakCounter": this.streakCounter
      })
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
