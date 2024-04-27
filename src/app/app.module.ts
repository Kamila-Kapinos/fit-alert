import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NavbarComponent} from "./common-components/components/navbar/navbar.component";
import {LayoutComponent} from "./common-components/components/layout/layout.component";
import {FooterComponent} from "./common-components/components/footer/footer.component";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";
import { ServiceWorkerModule } from '@angular/service-worker';

import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environments";
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { DailySurvey } from './activities/models/daily-survey';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LayoutComponent,
    FooterComponent
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    CommonModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    CollapseModule.forRoot(),
    NgbCollapse,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FormsModule,
  ],
  providers: [DailySurvey],
  bootstrap: [AppComponent]
})
export class AppModule { }
