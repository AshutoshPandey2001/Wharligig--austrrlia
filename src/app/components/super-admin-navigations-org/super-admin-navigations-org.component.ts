import { Component, OnInit } from '@angular/core';

import { UserDataService } from '../../services/user-data.service';
import { Constants } from '../../constants/constants';
import { EventService } from '../../services/event.service';
import { BackendService } from '../../services/backend.service'

var _this;
declare var $:any;

@Component({
  selector: 'app-super-admin-navigations-org',
  templateUrl: './super-admin-navigations-org.component.html',
  styleUrls: ['./super-admin-navigations-org.component.scss']
})
export class SuperAdminNavigationsOrgComponent implements OnInit {

  constructor(public userData: UserDataService, private event: EventService, private backendService: BackendService) { }

  selectedOrg:any;

  ngOnInit() {
    /*observable for organisation selection*/
    this.userData.getSelectedOrgObs().subscribe((data)=>{
      this.selectedOrg = data;
    });
  }

}
