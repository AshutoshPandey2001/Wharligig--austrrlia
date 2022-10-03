import { Injectable } from '@angular/core';
declare var $: any;
var _this;

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  apiCount = 0;

  constructor() {
    _this = this;
  }

  apiStart(){
    if(this.apiCount == 0) {
      this.loaderSetAtleastOneSecond();

      $("body").append("<div id=\"loading-div\" class=\"loading-container\">\r\n      <div class=\"loading\">\r\n        <div class=\"finger finger-1\">\r\n          <div class=\"finger-item\">\r\n            <span><\/span><i><\/i>\r\n          <\/div>\r\n        <\/div>\r\n        <div class=\"finger finger-2\">\r\n          <div class=\"finger-item\">\r\n            <span><\/span><i><\/i>\r\n          <\/div>\r\n        <\/div>\r\n        <div class=\"finger finger-3\">\r\n          <div class=\"finger-item\">\r\n            <span><\/span><i><\/i>\r\n          <\/div>\r\n        <\/div>\r\n        <div class=\"finger finger-4\">\r\n          <div class=\"finger-item\">\r\n            <span><\/span><i><\/i>\r\n          <\/div>\r\n        <\/div>\r\n        <div class=\"last-finger\">\r\n          <div class=\"last-finger-item\"><i><\/i><\/div>\r\n        <\/div>\r\n      <\/div>\r\n    <\/div>");
    }
    this.apiCount++;
  }

  apiStop(){
    if(this.apiCount != 0) {
      this.apiCount--;
    }
    if(this.apiCount == 0) {
      $('#loading-div').fadeOut('slow',function(){$('#loading-div').remove();});
      if($('#loading-div').length) {
        $( "#loading-div" ).remove();
      }
    }
  }

  loaderSetAtleastOneSecond(){
    this.apiCount++;
    setTimeout(function(){
      _this.apiStop();
    },1000);
  }
}
