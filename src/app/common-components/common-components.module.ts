import { NgModule } from '@angular/core'
import { NavbarComponent } from './components/navbar/navbar.component'
import { CommonModule } from '@angular/common'
import { CollapseModule } from 'ngx-bootstrap/collapse'

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    CollapseModule.forRoot()
  ],
  exports: [
  ]
})
export class CommonComponentsModule { }
