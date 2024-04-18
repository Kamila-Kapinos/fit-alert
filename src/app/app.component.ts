import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CommonComponentsModule} from "./common-components/common-components.module";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CommonComponentsModule, RouterLink,
    CommonModule,
    CollapseModule, NgbCollapse],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  title = 'fit-alert';
}
