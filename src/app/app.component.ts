import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CommonComponentsModule} from "./common-components/common-components.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CommonComponentsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  title = 'fit-alert';
}
