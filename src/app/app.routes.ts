// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home.component';
import { LayoutComponent } from './common-components/components/layout/layout.component';
import {NavbarComponent} from "./common-components/components/navbar/navbar.component";
import {FooterComponent} from "./common-components/components/footer/footer.component";
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'navbar', component: NavbarComponent },
      { path: 'footer', component: FooterComponent }
    ]
  },

  {
    path: 'home',
    component: HomeComponent
  }
];
