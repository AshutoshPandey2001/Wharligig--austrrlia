import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';

import { environment } from '../../../../../environments/environment';
declare var hbspt: any // put this at the top

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contact:any = {};
  @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;

  constructor() { }

  ngOnInit() {
    this.addRecaptchaScript();
  }

  ngAfterContentInit() {
    hbspt.forms.create({
      portalId: "6476238",
      formId: "16d957c5-e7d8-49be-9848-3b3c050404fb",
      target: "#hubspotForm"
    });
  }

  addRecaptchaScript() {
    window['grecaptchaCallback'] = () => {
      // this.renderReCaptcha();
    }   
    (function(d, s, id, obj){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { obj.renderReCaptcha(); return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));
   
  }

  /*Method to visible recaptcha*/
  renderReCaptcha() {
    window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey' : environment.RECAPTCHA_SITE_KEY,
      'callback': (response) => {
          console.log(response);
          /*Response once captcha accepted*/
      }
    });
  }
  submitConatctForm(){
    console.log("Submit");
    this.renderReCaptcha();
  }

}
