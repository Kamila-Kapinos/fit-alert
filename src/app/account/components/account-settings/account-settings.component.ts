import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent implements OnInit {
  public user: User;

  constructor(
    public service: AccountService,
    private router: Router,
  ) {
    this.user = service.currentUser;
  }

  ngOnInit() {
    try {
      this.service.getUserData().then((data) => {
        this.user = data;
        console.log('user data', data);
      });
    } catch (error) {
      console.error('Please log in to continue');
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.service.saveUserData(this.user);
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
    this.service.logout();
    this.router.navigate(['/login']);
  }
}
