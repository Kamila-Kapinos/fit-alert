import { Routes } from '@angular/router';
import { NavbarComponent } from './common-components/components/navbar/navbar.component';
import { FooterComponent } from './common-components/components/footer/footer.component';

export const routes: Routes = [
    {path: '', component: NavbarComponent},
    {path:'footer', component: FooterComponent}
];
