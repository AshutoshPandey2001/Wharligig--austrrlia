import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

import { CommonService } from '../../../services/common.service';
import { BackendService } from '../../../services/backend.service';
import { Constants } from '../../../constants/constants';
import { LoadingService } from '../../../services/loading.service';
import { UserDataService } from '../../../services/user-data.service';

@Component({
  selector: 'app-sop-inner-view',
  templateUrl: './sop-inner-view.component.html',
  styleUrls: ['./sop-inner-view.component.scss']
})
export class SopInnerViewComponent implements OnInit {

  sopData: any = {
  };
  sopId;
  htmlContent:any = '';
  userData:any={};

  constructor(private route: ActivatedRoute, private backendService: BackendService, private toastr: ToastrService, private loadingService: LoadingService, private userService: UserDataService, public commonService: CommonService, protected sanitizer: DomSanitizer) { }

  ngOnInit() {

    this.userData = this.userService.getUserData();
    this.route.params.subscribe(params => {

      if (this.userService.getSelectedOrg()) {
        this.userData.organization_name = this.userService.getSelectedOrg().organization_name
      }

      if(params.sopId != undefined) {
        this.getSOPById(params.sopId);
        this.sopId = params.sopId;
      }
    });
  }

  /*Get sop by id*/
  getSOPById(id){
    this.loadingService.apiStart();

    this.backendService.getSOPById(id)
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.sopData = result.data;
        while(this.sopData.content.includes(Constants.ORGANISATION_EMPTY_PLACEHOLDER) && this.userData.organization_name){
          this.sopData.content = this.sopData.content.replace(Constants.ORGANISATION_EMPTY_PLACEHOLDER, this.userService.getUserData().organization_name.trim());
          }
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.sopData.content);
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }
}
