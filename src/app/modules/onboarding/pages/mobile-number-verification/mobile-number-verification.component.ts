import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-number-verification',
  templateUrl: './mobile-number-verification.component.html',
  styleUrls: ['./mobile-number-verification.component.css']
})
export class MobileNumberVerificationComponent implements OnInit {

  user:any = {
    code: 91
  };

  constructor() { }

  ngOnInit() {
  }

  submit(){}

  onKeyUpEvent(index, event){
    const eventCode = event.which || event.keyCode;
    if (this.getCodeBoxElement(index).value.length === 1) {
      if (index !== 4) {
        this.getCodeBoxElement(index+ 1).focus();
      } else {
        this.getCodeBoxElement(index).blur();
      }
    }
    if (eventCode === 8 && index !== 1) {
      this.getCodeBoxElement(index - 1).focus();
    }
  }

  onFocusEvent(index) {
    for (let item = 1; item < index; item++) {
      const currentElement = this.getCodeBoxElement(item);
      if (!currentElement.value) {
          currentElement.focus();
          break;
      }
    }
  }

  getCodeBoxElement(index) {
    return <HTMLInputElement>document.getElementById('otp' + index);
  }
}
