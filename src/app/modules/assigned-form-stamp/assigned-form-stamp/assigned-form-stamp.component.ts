import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';

import { BackendService } from '../../../services/backend.service';
import { Constants } from '../../../constants/constants';
import { LoadingService } from '../../../services/loading.service';
import { UserDataService } from '../../../services/user-data.service';

@Component({
  selector: 'app-assigned-form-stamp',
  templateUrl: './assigned-form-stamp.component.html',
  styleUrls: ['./assigned-form-stamp.component.scss']
})
export class AssignedFormStampComponent implements OnInit {

  constructor(private backendService: BackendService, private loadingService: LoadingService, public userService: UserDataService, public commonService: CommonService) { }

  @Input() form:any;
  constants = Constants;

  ngOnInit() {
  }

  redirection(form){
    if(Constants.SUBMITTED == form.act) {
     return '/review-form/' + form.assid;
    }else if(Constants.ASSIGNED == form.act){
      return '/view-template/' + form.formid;
    }
    else{
      return '/view-assign-form/' + form.assid;
    }
  }
}
