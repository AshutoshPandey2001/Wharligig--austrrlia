import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {


  myCarouselOptions = {
    dots: false,
    nav: false,
    autoplay: true,
    loop: true,
    slideTransition: "linear",
    items: 5,
    autoplayTimeout: 3000,
    autoplaySpeed: 3000,
    responsiveClass:true,
    responsive:{
      0:{
        items:2.5
      },
      768:{
        items:5
      }
    }
  };

  companyImages =[
    '/assets/Dow_Chemical_Company_logo.svg.png', '/assets/download.png', '/assets/asset-1.png', '/assets/Dow_Chemical_Company_logo.svg.png', '/assets/download.png', '/assets/asset-1.png'
  ];

  constructor() { }

  ngOnInit() {
  }

}
