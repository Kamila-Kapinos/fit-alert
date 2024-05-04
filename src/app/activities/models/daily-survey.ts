/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/indent */
class Emotion {
  emotion: string = '';
  createdAt: Date = new Date();
}

export class DailySurvey {
  creationTime: Date = new Date();
  glassesOfWater: number = 0;
  sleepQuality: string = '';
  trainingTime: number = 0;
  veggiesInMeals: number = 0;
  excerciseOfTheDay: string = '';
  emotions: Emotion[] = [];
}
