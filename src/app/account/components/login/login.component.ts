import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { RouterLink } from '@angular/router';
import { ErrorsComponent } from '../../../forms/errors/errors.component';
import { User } from '../../models/user';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    ErrorsComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    console.log(this.loginForm.get('email'));
  }
  loginWithEmail() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid email and password.';
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.accountService.loginWithEmail(email, password).catch((error) => {
      this.errorMessage = 'Invalid email or password';
    });
  }

  loginWithGoogle() {
    const user: User = {
      name: '',
      surname: '',
      email: this.loginForm.value.email,
      phone: '',
    };

    this.accountService.loginWithGoogle(user).catch((error) => {
      this.errorMessage = error;
    });
  }

  loginWithFacebook() {
    this.accountService.loginWithFacebook().catch((error) => {
      this.errorMessage = error;
    });
  }
}
