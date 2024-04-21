import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./common-components/components/layout/layout.component";
import {LoginComponent} from "./account/components/login/login.component";
import {SignUpComponent} from "./account/components/sign-up/sign-up.component";
import {HomeComponent} from "./home-component/home.component";
import {DiaryComponent} from "./activities/components/diary/diary.component";

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
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'diary',
        component: DiaryComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
