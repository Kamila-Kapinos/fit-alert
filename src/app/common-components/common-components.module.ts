import { NgModule } from '@angular/core'
import { NavbarComponent } from './components/navbar/navbar.component'
import { CommonModule } from '@angular/common'
import { CollapseModule } from 'ngx-bootstrap/collapse'
import {CommonComponentsRoutingModule} from "./common-components-routing.module";
import {LayoutComponent} from "./components/layout/layout.component";
import {FooterComponent} from "./components/footer/footer.component";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    NavbarComponent,
    LayoutComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    CollapseModule.forRoot(),
    CommonComponentsRoutingModule,
    NgbCollapse,
  ],
  exports: [
  ]
})
export class CommonComponentsModule { }
