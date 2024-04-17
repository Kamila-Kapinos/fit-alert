import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {NavbarComponent} from "./components/navbar/navbar.component";

const routes: Routes = [
  { path: 'aaaaa', component: NavbarComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonComponentsRoutingModule { }
