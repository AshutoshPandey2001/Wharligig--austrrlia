import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Constants } from './constants/constants';
import { UserDataService } from './services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserDataService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let url: string = state.url;
    var userData = this.userService.getUserData();

    if(url.split('/')[1] == 'fill-form') {
      url = '/fill-form';
    }
    else if(url.split('/')[1] == 'review-form'){
      url = '/review-form';
    }else if(url.split('/')[1] == 'sub-chapter'){
      url = '/sub-chapter';
    }else if(url.split('/')[1] == 'sop'){
      url = '/sop';
    }else if(url.split('/')[1] == 'chapter'){
      url = '/chapter';
    }else if(url.split('/')[1] == 'edit-policy') {
      url = '/edit-policy';
    }else if(url.split('/')[1] == 'edit-template') {
      url = '/edit-template';
    }else if(url.split('/')[1] == 'edit-sop') {
      url = '/edit-sop';
    }

    switch(url){
      /*For non logged in users*/
      case '/dashboard':
      case '/submitted-form':
      case '/my-forms':
      case '/assigned-forms':
      case '/fill-form':
      case '/review-form':
      case '/policy':
      case '/sub-chapter':
      case '/organizations':
      case '/employee':
      case '/form-templates':
      case '/chapters':
      case '/chapter':
      case '/sop':
      case '/notification':
        if(!this.userService.isUserLoggedin()) {
          this.router.navigate(['/login']);
          return false;
        }
      break;

      /*For logged in users*/
      case '/login':
        if(this.userService.isUserLoggedin()) {
          this.router.navigate(['/dashboard']);
          return false;
        }
      break;

      /*For super admin*/
      case '/create-policy':
      case '/edit-policy':
      case '/create-template':
      case '/edit-template':
      case '/create-sop':
      case '/edit-sop':
      
      if(this.userService.getUserData().role != Constants.SUPER_ADMIN) {
        this.router.navigate(['/dashboard']);
        return false;
      }      
      break;
    }

    return true;
  }
}
