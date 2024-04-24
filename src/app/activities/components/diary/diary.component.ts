import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent {
  exampleDiary = {
    2024: {
      Jan: {
        '02/01/2024': {
          fullDate: '02/01/2024',
          'number of glasses of water': 0,
          'number of veggies in your meals': 3,
          'training time': '3h',
          'exercise of the day': 'jogging',
          'sleep qulity': 'very good',
          'current mood img url': 'https://picsum.photos/id/237/200/300'
        },
        '05/01/2024': {
          fullDate: '05/01/2024',
          'number of glasses of water': 3,
          'number of veggies in your meals': 4,
          'training time': '2h',
          'exercise of the day': 'skiing',
          'sleep qulity': 'meh',
          'current mood img url': 'https://picsum.photos/id/39/367/267'
        }
      }
    }
  }

  diary = this.exampleDiary
}
