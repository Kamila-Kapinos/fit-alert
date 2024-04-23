import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  user: string = 'Sam';
  counter: number = 0;
  yourChallenge: string = ''

  challenges: Array<string> = ['Eat two carrots', 'Prepare a veggie Meal', 'Do 10 push-ups'];
  ngOnInit(): void {
    this.yourChallenge = this.getRandomChallenge();
  }
  getRandomChallenge(): string {
    const randomIndex = Math.floor(Math.random() * this.challenges.length);
    return this.challenges[randomIndex];
  }
}
