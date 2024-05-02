import { Injectable } from '@angular/core';
import {Router, CanActivateChild} from '@angular/router';
import {AccountService} from "./account.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

  constructor(private accountService: AccountService, private router: Router) {}

  async canActivateChild() {
    const user = await this.accountService.isAuthenticated();
    if (user) {
      return true;
    } else {
      await this.router.navigate(['/login']);
      return false;
    }
  }
}
