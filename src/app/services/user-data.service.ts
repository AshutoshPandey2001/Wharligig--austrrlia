import { Injectable } from '@angular/core';
import { Observable,Subject} from 'rxjs';
import { Router } from '@angular/router';
import { Constants } from '../constants/constants';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private router: Router) {
  }

  private selectedOrgObs = new Subject<any>();
  selectedOrganization:any = false;

  setUserData(data){
    if (data && (data.organization_name == null ||  data.organization_name == undefined)) {
      data.organization_name = "'Company Name'";
    }
    localStorage.setItem("whirligigUser", JSON.stringify(data));
  }

  getUserData(){
    return JSON.parse(localStorage.getItem("whirligigUser")) || {};
  }

  isUserLoggedin(){
    var user = this.getUserData();
    return (user && user.token);
  }

  logout(){
    localStorage.setItem("whirligigUser", null);
    this.router.navigate(['login']);
  }

  silentLogout(){
    localStorage.setItem("whirligigUser", null);
  }

  setSelectedOrg(data){
    if (data) {
      data['role'] = Constants.ADMIN;
    }
    this.selectedOrganization = data;
    this.selectedOrgObs.next(data);
  }

  getSelectedOrgObs(){
    return this.selectedOrgObs.asObservable();
  }

  getSelectedOrg(){
    return this.selectedOrganization;
  }
}
