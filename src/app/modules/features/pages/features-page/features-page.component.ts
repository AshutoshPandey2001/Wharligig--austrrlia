import { Component, OnInit, HostListener } from '@angular/core';
declare var $:any;

var isAnimating = false;

var currentScrollSection = 1;
var scrollOffset = 0;
@Component({
  selector: 'app-features-page',
  templateUrl: './features-page.component.html',
  styleUrls: ['./features-page.component.scss']
})
export class FeaturesPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:scroll')
  checkScroll() {
    let height = 0;
    if(isAnimating) {
      return;
    }

    if(scrollOffset < Math.floor(($(window).scrollTop() + height)/100)) {
      if(currentScrollSection < 4) {
        isAnimating = true;
        $('html, body').animate({
          scrollTop: $(".scroll-" + ++currentScrollSection).offset().top
        }, 500);
        setTimeout(function(){
          scrollOffset = Math.floor($(window).scrollTop()/100);
          isAnimating = false;
        }, 700);
      }
    }
    else if(scrollOffset > Math.floor(($(window).scrollTop() + height)/100)){
      if(currentScrollSection > 1) {
        isAnimating = true;
        $('html, body').animate({
          scrollTop: $(".scroll-" + --currentScrollSection).offset().top
        }, 500);
        setTimeout(function(){
          scrollOffset = Math.floor($(window).scrollTop()/100);
          isAnimating = false;
        }, 700);
      }
    }
  }
}
