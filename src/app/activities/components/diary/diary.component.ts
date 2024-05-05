/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DailyService } from '../../services/daily.service';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss',
})
export class DiaryComponent {
  userDiary: any;

  constructor(public dailyService: DailyService) {
  }

  ngOnInit(): void {
    this.dailyService
      .getDiary()
      .then((data) => {
        this.userDiary = data;
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching diary data:', error);
      });
  }

  formatDateTime(dateTime: { seconds: number; nanoseconds: number }): string {
    const milliseconds =
      dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
    const formattedDate = new Date(milliseconds);
    const hours = formattedDate.getHours();
    const minutes = formattedDate.getMinutes();
    const seconds = formattedDate.getSeconds();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getEmotionClass(emotion: string): string {
    switch (emotion.toLowerCase()) {
      case 'thrilled':
        return 'emotion-green';
      case 'sleepy':
        return 'emotion-yellow';
      default:
        return 'emotion-red';
    }
  }
  getSleepQualityClass(sleepQuality: string): string {
    switch (sleepQuality.toLowerCase()) {
      case 'good':
        return 'quality-good';
      case 'bad':
        return 'quality-bad';
      default:
        return 'quality-medium';
    }
  }
}
