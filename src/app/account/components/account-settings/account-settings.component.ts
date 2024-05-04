import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent implements OnInit {
  public user!: User;

  constructor(
    public accountService: AccountService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.user = this.accountService.currentUser ?? {
      name: '',
      surname: '',
      email: '',
      phone: '',
    };
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.accountService.saveUserData(this.user);
      console.log('Saved data');
    } else {
      console.log('Not valid form');
    }
  }

  public getFullName() {
    if (this.user.surname == '') {
      return 'John Doe';
    } else {
      return this.user.name + ' ' + this.user.surname;
    }
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['/login']);
  }
}
