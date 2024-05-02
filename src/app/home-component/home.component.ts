import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../articles/article/services/articles.service";
import {NgForOf} from "@angular/common";
import firebase from "firebase/compat";
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import {RouterLink} from "@angular/router";
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  user: string | null = sessionStorage.getItem('userName');
  counter = 0;
  yourChallenge = '';
  challenges = ['Eat two carrots', 'Prepare a veggie meal', 'Do 10 push-ups'];
  trendingArticles: any[] = [];


  constructor(private articlesService: ArticlesService, private notificationsService: NotificationsService) { }


  ngOnInit(): void {
    this.yourChallenge = this.getRandomChallenge();
    this.articlesService.getArticles().then(
      data => {
        this.trendingArticles = data;
        console.log(data);
      }
    ).catch(
      error => {
        console.error('Error fetching articles:', error);
      }
    );
  }

  getRandomChallenge(): string {
    const randomIndex = Math.floor(Math.random() * this.challenges.length);
    return this.challenges[randomIndex];
  }

  challengeCompleted(){
    this.notificationsService.sendNotification("Challenge completed", "Congrats on completing challenge! Keep up good work!")
  }
}

