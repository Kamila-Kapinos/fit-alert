import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AccountService} from "../../services/account.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private accountService: AccountService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  loginWithEmail() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid email and password.';
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.accountService.loginWithEmail(email, password)
      .catch(error => {
        this.errorMessage = 'Invalid email or password';
      });
  }

  loginWithGoogle() {
    this.accountService.loginWithGoogle()
      .catch(error => {
        this.errorMessage = error;
      });
  }

  loginWithFacebook() {
    this.accountService.loginWithFacebook()
      .catch(error => {
        this.errorMessage = error;
      });
  }
}
