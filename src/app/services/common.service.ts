import { Injectable } from '@angular/core';
import { Observable,Subject} from 'rxjs';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from '@angular/platform-browser';
import { Constants } from '../constants/constants';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(protected sanitizer: DomSanitizer) { }

  months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

  categoryList = ['Fungal Infection', 'Psoriasis', 'Atopic Dermatitis', 'Urticaria', 'Urticaria', 'Fungal Infection', 'Psoriasis', 'Atopic Dermatitis', 'Urticaria', 'Urticaria'];

  removeWhiteSpace(str){
    if(str == undefined || str == null) {
      return "";
    }
    return str.replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
  }

  getDomainNameFromURL(url){
    return new URL(url).hostname;
  }

  /*Returning date October 12, 2019 this formate*/
  getFormatedDate(date){
    if(date == undefined || date == null || date == '') {
      return '';
    }
    let d = new Date(parseInt(date));
    return this.months[(d.getMonth())] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  getDDMMYYYYFormatedDate(date){
    if(date == undefined || date == null || date == '') {
      return '';
    }
    let d = new Date(parseInt(date));

    return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();
  }

  getCategoryList(){
    return this.categoryList;
  }

  isEmailValid(email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
  }

  getUserRoleById(role){
    switch(role){
      case Constants.SUPER_ADMIN:
        return 'Super Admin';
      case Constants.ADMIN:
        return 'Admin';
      case Constants.MANAGER:
        return 'Manager';
      case Constants.EMPLOYEE:
        return 'Employee';
      default:
        return 'Team Leader';
    }
  }

  getDiffBetweenDate(date){
    let currentDate = new Date();
    let oldDate = new Date(parseInt(date));

    return Math.floor((Date.UTC(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  scrollToId(id){
    $('html, body').animate({
      scrollTop: $("#" + id).offset().top - 50
    }, 2000);
  }
}
