import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { fromEvent } from 'rxjs';
import { Subscription } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  isFooter = false;
  user:any = {};

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isFooter = this.activatedRoute.root.firstChild.snapshot.data.isFooter;
    });
  }

  subscribe(){
    window.open("https://pwcompliance.us19.list-manage.com/subscribe/post?u=de988be1d1b02a9cf5b89e8ce&amp;id=81d46a9997&&MERGE0=" + this.user.email, "_blank");
  }
}
