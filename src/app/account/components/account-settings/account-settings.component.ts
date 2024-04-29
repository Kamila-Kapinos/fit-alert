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

  ngOnInit(){
    console.log("user ID", this.service.userId)
    try{
      this.service.getUserData().then((data) => {this.user = data; console.log("user data", data)})
      // console.log("user data", this.user)
    }
    catch(error){
      console.error("Please log in to continue");
    }

  }

  onSubmit(form: NgForm) {
    if(form.valid){
      this.service.saveUserData(this.user)
      console.log("Saved data")
    }
    else{
      console.log("Not valid form")
    }

  }

  public getFullName(){
    if(this.user.surname==""){
      return "John Doe"
    }
    else{
      return this.user.name+" "+this.user.surname
    }
  }
}
