import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  
  user = sessionStorage.getItem('userName');
  counter: number = 0;
  yourChallenge: string = ''

  challenges: Array<string> = ['Eat two carrots', 'Prepare a veggie meal', 'Do 10 push-ups'];

  ngOnInit(): void {
    this.yourChallenge = this.getRandomChallenge();
  }

  getRandomChallenge(): string {
    const randomIndex = Math.floor(Math.random() * this.challenges.length);
    return this.challenges[randomIndex];
  }
}
