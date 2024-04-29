import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import firebase from "firebase/compat";
import {User} from "../../models/user";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule
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
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      const newUser: User = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
        hashedPassword: formData.password // Zastosowanie zaszyfrowanego hasła
      };
      this.accountService.signUpWithUser(newUser)
        .catch(error => {
          // Obsługa błędów rejestracji
          console.error('Błąd rejestracji:', error);
          // Tutaj możesz wyświetlić odpowiedni komunikat dla użytkownika
        });
    } else {
      // Jeśli formularz jest nieprawidłowy, oznacz wszystkie pola jako dotknięte, aby wyświetlić walidatory
      this.signupForm.markAllAsTouched();
    }
  }
}
