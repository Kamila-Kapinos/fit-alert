import { Component } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private auth: AngularFireAuth, private router: Router) {}

  loginWithEmail() {
    this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        console.log('Logowanie udane');
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
  }
}
