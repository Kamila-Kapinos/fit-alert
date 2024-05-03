import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../models/user';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ErrorsComponent } from '../../../forms/errors/errors.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    ErrorsComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        surname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\+?\d{0,3}\s?[\d\s-]{9,}$/),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        termsAndConditions: [false, Validators.requiredTrue],
      },
      { validator: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    const isValid = password === confirmPassword;

    if (!isValid) {
      formGroup.setErrors({ passwordMismatch: true });
    } else {
      formGroup.setErrors(null);
    }

    return isValid ? null : { passwordMismatch: true };
  }

  onSubmit() {
    const formData = this.signupForm.value;
    const password = formData.password;

    if (this.signupForm.valid) {
      const newUser: User = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
      };

      this.accountService
        .signUpWithUser(newUser, password)
        .catch((error) => {
          console.log(error.message);
          if (error.message.indexOf('auth/email-already-in-use') !== -1) {
            alert('User with email: ' + formData.email + ' already exists');
          } else {
            alert('System error! Please contact with app administrator');
          }
          console.error(error);
          return null;
        })
        .then((ret) => {
          if (ret) {
            alert('Account has been created. Please sign in.');
            this.router.navigate(['/login']);
          }
        });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  updateTermsAndConditions(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      const termsAndConditionsControl =
        this.signupForm.get('termsAndConditions');
      if (termsAndConditionsControl) {
        termsAndConditionsControl.setValue(isChecked);
      }
    }
  }
}
