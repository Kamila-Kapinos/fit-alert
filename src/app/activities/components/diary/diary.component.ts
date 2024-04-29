/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DailyService } from '../../services/daily.service';
import { CollectionReference, DocumentData } from 'firebase/firestore';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss',
})
export class DiaryComponent {
  userDiary: any

  constructor(public dailyService: DailyService) {
    // this.userDiary = this.readDiary()
  }

  ngOnInit(): void{
    this.dailyService.getDiary().then(
      data => {this.userDiary = data;
    }).catch((error) => {console.error('Error fetching diary data:', error);
    });
    // console.log(this.diary2);
  }
}
