import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private accountService: AccountService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
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
    const confirmPassword = formData.confirmPassword;

    if (this.signupForm.valid) {
      const newUser: User = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
      };

      this.accountService.signUpWithUser(newUser, password)
        .then(() => {
          console.log('Rejestracja udana');
        })
        .catch(error => {
          console.error('Błąd rejestracji:', error);
        });
    } else {
      if (this.signupForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
        console.log('Password and confirm password must match');
      } else {
        this.signupForm.markAllAsTouched();
      }
    }
  }
}
