import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';

import { UserDataService } from './services/user-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'whirligig1';

  constructor(private wowService: NgwWowService, public userData: UserDataService){
    /*For animated css*/
    this.wowService.init();
  }

  selectedOrg:any;

  ngOnInit() {
    /*observable for organisation selection*/
    this.userData.getSelectedOrgObs().subscribe((data)=>{
      this.selectedOrg = data;
    });
  }
}
