import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./common-components/components/layout/layout.component";
import {LoginComponent} from "./account/components/login/login.component";
import {SignUpComponent} from "./account/components/sign-up/sign-up.component";
import {HomeComponent} from "./home-component/home.component";
import {DiaryComponent} from "./activities/components/diary/diary.component";
import { DailySurveyComponent } from './activities/components/daily-survey/daily-survey.component';
import { AccountSettingsComponent } from './account/components/account-settings/account-settings.component';
import { ArticleComponent } from './articles/article/article.component';
import {AuthGuard} from "./account/services/auth.guard";


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [AuthGuard], // Dodanie AuthGuard jako strażnika dla dzieci
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'diary',
        component: DiaryComponent,
      },
      {
        path: 'today',
        component: DailySurveyComponent
      },
      {
        path: 'account',
        component: AccountSettingsComponent
      },
      {
        path: 'article/:articleID',
        component: ArticleComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
