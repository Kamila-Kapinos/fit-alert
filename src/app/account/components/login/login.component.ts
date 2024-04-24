import { Component } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private auth: AngularFireAuth) {}

  loginWithEmail() {
    this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        console.log('well done')
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
  }
}
