import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent {

  public user: User;
  constructor(public service: AccountService){
    this.user = service.currentUser
  }

  onSubmit(form: NgForm) {
    console.log("Submitted form", form.value())
  }
}
